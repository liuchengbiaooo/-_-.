var utils = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNum:'',
    order: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNum: options.orderNum
    })
    wx.request({
      url: require('../../../config').findbusinessUrl,
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
    this.loadContent();
  },

  btnOrderComment: function () {
    wx.navigateTo({
      url: '/pages/order-comment/order-comment?orderNum=' + this.data.orderNum,
    })
  },
  btnPhone: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.business.web_phone
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  btnOrderPay: function () {
    utils.orderPay(this.data.orderNum, '20')
  },
  btnCancelOrder: function() {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '您确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '处理中...',
            icon: 'loading'
          })
          wx.request({
            url: require('../../../config').orderCanceltUrl + "/" + _this.data.orderNum, //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
              openid: app.globalData.userInfo.openid
            },
            success: resp => {
              console.log(resp)
              if (resp.data.r == "1") {
                wx.hideToast();
                _this.setData({
                  'order.orderStatus':'50',
                  'order.textOrderStatus': '交易关闭'
                })
              }
            }
          })
        }
      }
    })
  },
  loadContent: function() {
    wx.showNavigationBarLoading();
    wx.request({
      url: require('../../../config').orderDetailtUrl + "/" + this.data.orderNum, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      data: {
        openid: app.globalData.userInfo.openid
      },
      success: resp => {
        console.log(resp);
        this.setData({
          order: resp.data.obj
        })
        wx.hideNavigationBarLoading();
      }
    })
  }
})