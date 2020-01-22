// pages/promotion/details/details.js
var WxParse = require('../../../wxParse/wxParse.js');
var getuserinfo = require('../../../utils/getuserinfo.js');
var utils = require('../../../utils/util.js');
const { $Toast } = require('../../dist/base/index');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionId: 0,

    //是否采用衔接滑动  
    circular: true,
    //是否显示画板指示点  
    indicatorDots: true,
    //选中点的颜色  
    indicatorcolor: "#000",
    //是否竖直  
    vertical: false,
    //是否自动切换  
    autoplay: true,
    //自动切换的间隔
    interval: 5000,
    //滑动动画时长毫秒  
    duration: 100,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    current: 0,

    end_time: '',
    clock: '',

    business: null,
    promotions: null,

    visible1: false,
    actions1: [
      {
        name: '去分享',
        icon: 'share',
        openType: 'share'
      },
      {
        name: '分享到朋友圈',
        icon: 'share',
        openType: ''
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var promotionId = options.promotionId;

    this.setData({
      promotionId: promotionId,
    })
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var urlsq = currentPage.route + "&promotionId=" + promotionId; //当前页面url
    getuserinfo.authorize(urlsq);
    this.loadData();
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
  handleCancel1() {
    this.setData({
      visible1: false
    });
  },
  handleClickItem1({ detail }) {
    const index = detail.index + 1;
    console.log(index);
    if (index == 2) {
      this.qrCode();
    }
  },
  btnShare: function () {
    this.setData({
      visible1: true
    });
  },
  btnShop: function() {
    if (!this.data.promotions.overdue) {
      wx.showModal({
        title: '提示',
        content: '活动已经结束'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/promotion/shop/shop-promotion?promotionId=' + this.data.promotionId,
    })
  },

  btnQRCode: function () {
    var _this = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
        
      },
      fail(res) {
        $Message({
          content: '扫码出错了！',
          type: 'error'
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData();
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
    this.loadData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  loadData: function () {
    var that = this;

    wx.showNavigationBarLoading();
    wx.request({
      url: require('../../../config').findPromotionUrl,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      data: {
        promotionId: this.data.promotionId
      },
      success: resp => {
        this.setData({
          promotions: resp.data,
          end_time: resp.data.overdueDate
        })
        wx.setNavigationBarTitle({
          title: resp.data.name//页面标题为路由参数
        })
        
        WxParse.wxParse('content', 'html', resp.data.content, that, 5);
        if (!resp.data.showPage) {
          utils.countdown(that);
        }
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }
    })

    wx.request({
      url: require('../../../config').findbusinessUrl, //仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        this.setData({
          business: res.data
        });
      }
    })
  },
  qrCode: function () {
    var self = this;
    $Toast({
      content: '处理中...',
      type: 'loading',
      duration: 0
    });
    var qrurl = 'pages/promotion/details/details';
    wx.request({
      url: require('../../../config').createPosterUrl, //后端request地址
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        path: qrurl, //A、C类接口使用,冒号之前是这个数值在后端的名称，冒号之后是这个数值在前端的名称
        width: 600, //这里可以不设置，在后端设置也可以
        title: this.data.promotions.name,
        amount: this.data.promotions.price,
        volume: this.data.promotions.volume,
        openid: app.globalData.userInfo.openid,
        promotionId: this.data.promotionId
      },
      success: function (res) {
        console.log(res);
        var url = res.data.msgs;
        if (res.data.r == "1") {
          wx.downloadFile({
            url: url, //这里填写你服务器上保存海报图片的目录网址
            success: function (res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(result) {
                  wx.showModal({
                    title: '提示',
                    content: '二维码海报已保存在手机相册，请进入手机相册找到这张海报并分享到微信朋友圈。',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        
                      }
                    }
                  })
                }
              });
              self.showImages(url);
            }, fail: function (res) {
              self.showImages(url);
            }
          });
        } else {
          $Toast.hide();
          wx.showModal({
            title: '提示',
            content: resp.data.msgs,
            showCancel: false,
            success: function (res) {

            }
          })
        }
      },
      fail: function (res) {
        //console.log('isFail')
      }
    });
  },
  showImages: function (imageUrl) {
    console.log(imageUrl);
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: [imageUrl] // 需要预览的图片http链接列表
    })
    $Toast.hide();
  }
})