var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();

var qqmapsdk;
Page({
  data: {
    shpitoId: 0,
    typeshpto:'10',
    popErrorMsg: '',
    borderRadius: 5,
    latitude: 0,
    longitude: 0,
    markers: [],
    callout: {
      content: '预计还有10分钟到达',
      bgColor: "#736F6E",
      color: "#ffffff",
      padding: 10,
      display: "ALWAYS",
      borderRadius: 5
    },
    mobileLocation: {//移动选择位置数据
      longitude: 0,
      latitude: 0,
      address: '',
      menpaihao: ''
    },
    contacts: {
      cttname: '',
      shpMobile: '',
      defaulted: ''
    }
  },
  onLoad: function (options) {
    this.setData({
      shpitoId: options.shpitoId,
      typeshpto: options.typeshpto
    })
    
    if (this.data.shpitoId != 0) {
      wx.request({
        url: require('../../config').shiptoUrl,
        method: "get",
        data: {
          openid: app.globalData.userInfo.openid,
          shiptoId: this.data.shpitoId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          console.log(res);
          this.setData({
            'contacts.cttname': res.data.cttname,
            'contacts.shpMobile': res.data.shpMobile,
            'contacts.defaulted': res.data.defaulted
          })
          this.loadLocation(res.data.latitude, res.data.longitude);
        }
      })
    } else {
      var self = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            self.authorizeUserLocation(self);
          } else {
            self.loadditu(self);
          }
        }
      })
    }
  },
  //加载地址
  loadLocation: function (latitude, longitude) {
    var that = this;
    qqmapsdk = new QQMapWX({
      key: 'UTUBZ-VCV6Q-LYQ54-GISPV-M6XX2-OVBZX'
    });
    var mobileLocation = {
      latitude: latitude,
      longitude: longitude,
    };
    //根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (addressRes) {
        var address = addressRes.result.address_component.province + addressRes.result.address_component.city
          + addressRes.result.address_component.district;
        var menpaihao = addressRes.result.formatted_addresses.recommend
        mobileLocation.address = address;
        mobileLocation.menpaihao = menpaihao;
        console.log(addressRes)

        var marker = [{
          id: 0,
          latitude: latitude,
          longitude: longitude,
          callout: {//窗体
            content: menpaihao,
            bgColor: that.data.callout.bgColor,
            color: that.data.callout.color,
            padding: that.data.callout.padding,
            display: that.data.callout.display,
            borderRadius: that.data.callout.borderRadius
          },
        }];

        that.setData({
          latitude: latitude,
          longitude: longitude,
          markers: marker,
        });

        //当前位置信息
        that.setData({
          mobileLocation: mobileLocation,
        });

      },
      complete: function (res) {
        console.log(res);
      }
    });

  },
  //移动选点
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        /*let mobileLocation = {
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address,
        };
        that.setData({
          mobileLocation: mobileLocation,
        });*/
        console.log(res);
        var mobileLocation = {
          latitude: res.latitude,
          longitude: res.longitude,
        };
        //根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.address_component.province + addressRes.result.address_component.city
              + addressRes.result.address_component.district;
            var menpaihao = addressRes.result.formatted_addresses.recommend
            mobileLocation.address = address;
            mobileLocation.menpaihao = menpaihao;
            console.log(addressRes)

            var marker = [{
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude,
              callout: {//窗体
                content: menpaihao,
                bgColor: that.data.callout.bgColor,
                color: that.data.callout.color,
                padding: that.data.callout.padding,
                display: that.data.callout.display,
                borderRadius: that.data.callout.borderRadius
              },
            }];

            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: marker,
            });

            //当前位置信息
            that.setData({
              mobileLocation: mobileLocation,
            });

          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  authorizeUserLocation: function (self) {

    wx.showModal({
      title: '是否授权当前位置',
      content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
      success: function (res) {
        if (res.cancel) {
          console.info("1授权失败返回数据");
          self.authorizeUserLocation(self);
        } else if (res.confirm) {
          //village_LBS(that);
          wx.openSetting({
            success: function (data) {
              console.log(data);
              if (data.authSetting["scope.userLocation"] == true) {
                wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                  duration: 5000
                })
                //再次授权，调用getLocationt的API
                self.loadditu(self);
              } else {
                console.info("再次授权");
                self.authorizeUserLocation(self);
              }
            }
          })
        }
      }
    })
  },
  loadditu: function (that) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'VCSBZ-QS2KP-RSLD5-VDKE2-NX22T-45BUD'
    });

    //获取位置
    wx.getLocation({
      type: 'gcj02',//默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
      success: function (res) {
        console.log(res);
        var mobileLocation = {
          latitude: res.latitude,
          longitude: res.longitude,
        };
        //根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.address_component.province + addressRes.result.address_component.city
              + addressRes.result.address_component.district;
            var menpaihao = addressRes.result.formatted_addresses.recommend
            mobileLocation.address = address;
            mobileLocation.menpaihao = menpaihao;
            console.log(addressRes)

            var marker = [{
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude,
              callout: {//窗体
                content: menpaihao,
                bgColor: that.data.callout.bgColor,
                color: that.data.callout.color,
                padding: that.data.callout.padding,
                display: that.data.callout.display,
                borderRadius: that.data.callout.borderRadius
              },
            }];

            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: marker,
            });

            //当前位置信息
            that.setData({
              mobileLocation: mobileLocation,
            });

          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    });

    this.mapCtx = wx.createMapContext('qqMap');
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var _this = this;
    if (e.detail.value.menpaihao == null || e.detail.value.menpaihao == "") {
      this.setData(
        { popErrorMsg: "地址门牌号不能为空" }
      );
      this.ohShitfadeOut();
      return;
    } else if (e.detail.value.cttname == null || e.detail.value.cttname == "") {
      this.setData(
        { popErrorMsg: "地址联系人姓名不能为空" }
      );
      this.ohShitfadeOut();
      return;
    } else if (e.detail.value.shpMobile == null || e.detail.value.shpMobile == "") {
      this.setData(
        { popErrorMsg: "地址联系人电话不能为空" }
      );
      this.ohShitfadeOut();
      return;
    }
    var defaults = "";
    if (e.detail.value.defaulted) {
      defaults = "Y";
    }
    wx.request({
      url: require('../../config').cartShptoSaveUrl,
      method: "POST",
      data: {
        openid: app.globalData.userInfo.openid,
        cttname: e.detail.value.cttname,
        shpMobile: e.detail.value.shpMobile,
        menpaihao: e.detail.value.menpaihao,
        shpAddr: e.detail.value.address,
        defaulted: defaults,
        id: this.data.shpitoId,
        latitude: this.data.mobileLocation.latitude,
        longitude: this.data.mobileLocation.longitude
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.r == "1") {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          if (this.data.typeshpto == '20') {
            wx.navigateBack({ delta: 2 })
          } else {
            wx.navigateBack({
              
            })
          }
        } else {
          _this.setData(
            { popErrorMsg: res.data.msgs }
          );
          _this.ohShitfadeOut();
        }
      }
    })
  },
  ohShitfadeOut: function () {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  }
}); 