// pages/meals/meals.js
const { $Toast } = require('../../dist/base/index');
var getuserinfo = require('../../../utils/getuserinfo.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible1: false,
    height: 0,
    categorys: null,
    curId: 0,
    cart: null,
    business: null,

    current: 'tab1',
    comments: null,
    totalPageNum: 0,    // 总页数
    currentPage: 1,  // 当前页数  默认是1
    showPage: false,

    actions2: [
      {
        name: '选好了',
        color: '#ed3f14'
      }
    ],
    actions3: [
      {
        name: '关闭'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var urlsq = currentPage.route; //当前页面url
    getuserinfo.authorize(urlsq);

    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          height: res.windowHeight
        })
      }
    })

    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0
    });

    var urlre = require('../../../config').viewmerchant + "?openid=" + app.globalData.userInfo.openid + "&cartType=30";
    wx.request({
      url: urlre, //仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          categorys: res.data
        });

        this.loadCartList();
      }
    })
    wx.request({
      url: require('../../../config').findbusinessUrl, //仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          business: res.data
        });
      }
    })

  },
  loadCartList: function () {
    wx.request({
      url: require('../../../config').cartListUrl + "?openid=" + app.globalData.userInfo.openid + "&cartType=30",
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {

        if (res.data.r == "1") {
          console.log(res);
          this.setData({
            cart: res.data.obj
          });
        }
      }
    })
    wx.request({
      url: require('../../../config').searchMercantComUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      data: {
        pn: 1,
      },
      success: resp => {
        console.log(resp);
        this.setData({
          totalPageNum: resp.data.pgm.totalPageNum,
          comments: resp.data.datas
        })
        if (resp.data.totalRecords <= 0) {
          this.setData({ showPage: true })
        } else {
          this.setData({ showPage: false })
        }
        $Toast.hide();
      }
    })
  },
  btnMiaoding: function (e) {
    var id = e.currentTarget.dataset.index;
    this.setData({
      curId: id
    })
  },
  btnAddCart: function (e) {
    var dataname = e.currentTarget.dataset.name;
    var cataIndex = e.currentTarget.dataset.calindex;
    var prodIndex = e.currentTarget.dataset.index;
    wx.showLoading({
      title: '处理中...',
    })
    wx.request({
      url: require('../../../config').cartAddUrl + dataname + "&openid=" + app.globalData.userInfo.openid + "&cartType=30",
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.r == "1") {
          var prodNumber = this.data.categorys[cataIndex].products[prodIndex].cartNumber + 1;
          this.setData({
            ['categorys[' + cataIndex + '].products[' + prodIndex + '].cartNumber']: prodNumber
          });
          this.loadCartList();
          wx.hideLoading();
        }
      }
    })
  },
  btnChange: function (e) {
    var prodid = e.currentTarget.dataset.id;
    var types = e.currentTarget.dataset.type;
    var cataIndex = 0;
    var prodIndex = 0;
    this.data.categorys.forEach(function (item, i) {
      item.products.forEach(function (product, j) {
        if (prodid == product.id) {
          cataIndex = i;
          prodIndex = j;
        }
      })
    })
    wx.showLoading({
      title: '处理中...',
    })
    wx.request({
      url: require('../../../config').cartOperationUrl,
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        openid: app.globalData.userInfo.openid,
        prodId: prodid,
        cartType: "30",
        type: types
      },
      success: res => {
        if (res.data.r == "1") {
          var prodNumber = this.data.categorys[cataIndex].products[prodIndex].cartNumber;
          this.setData({
            ['categorys[' + cataIndex + '].products[' + prodIndex + '].cartNumber']: parseInt(res.data.msgs)
          });
          this.loadCartList();
          wx.hideLoading();
        }
      }
    })
  },
  handleOpen2: function () {
    if (this.data.cart.totalItems <= 0) {
      wx.showModal({
        title: "提示",
        content: "您的购物车空空如也~",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    this.setData({
      visible2: true
    });
  },
  handleCancel2() {
    this.setData({
      visible2: false
    });
  },
  btnCheckout: function () {
    wx.navigateTo({
      url: '/pages/reserve/reserve'
    })
  },

  //####################################
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  btnPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.business.web_phone
    })
  },
  btnMap: function () {
    var latlng = this.data.business.web_latlng_kye.split("#");
    wx.openLocation({
      latitude: parseFloat(latlng[0]),
      longitude: parseFloat(latlng[1]),
      scale: 18
    })
  },
  btnAnquanda: function () {
    var imgs = this.data.business.web_business.split("#");
    wx.previewImage({
      current: imgs[0], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  btnViewImage: function (e) {
    var index = e.currentTarget.dataset.comindex;
    var imageUrl = e.currentTarget.dataset.image;
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: this.data.comments[index].images // 需要预览的图片http链接列表
    })
  },
  //###############################

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var urlre = require('../../../config').viewmerchant + "?openid=" + app.globalData.userInfo.openid + "&cartType=30";
    wx.request({
      url: urlre, //仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          categorys: res.data
        });

        this.loadCartList();
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var urlre = require('../../../config').viewmerchant + "?openid=" + app.globalData.userInfo.openid + "&cartType=30";
    wx.request({
      url: urlre, //仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          categorys: res.data
        });

        this.loadCartList();
        wx.stopPullDownRefresh();
      }
    })

  },
  btnNotice: function () {
    console.log(this.data.visible1);
    this.setData({
      visible1: true
    });

  },
  handleClose1() {
    this.setData({
      visible1: false
    });
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var self = this;
    console.log(self.data.totalPageNum + " , " + self.data.currentPage);
    // 当前页是最后一页
    if (self.data.currentPage >= self.data.totalPageNum) {
      console.log("最后一页了");
      return;
    }
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    var tempCurrentPage = self.data.currentPage;
    tempCurrentPage = tempCurrentPage + 1;
    self.setData({
      currentPage: tempCurrentPage
    })

    wx.showNavigationBarLoading();
    wx.request({
      url: require('../../../config').searchMercantComUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      data: {
        pn: self.data.currentPage,
      },
      success: resp => {
        wx.hideNavigationBarLoading();
        var tempArray = self.data.comments;
        tempArray = tempArray.concat(resp.data.datas);
        self.setData({
          comments: tempArray
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})