var utils = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNumber: options.orderNumber
    })
    wx.request({
      url: require('../../../config').orderSuccessUrl, //仅为示例，并非真实的接口地址
      method: "get",
      data: {
        order: options.orderNumber,
        openid: app.globalData.userInfo.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          order: res.data.obj
        });
        this.btnOrderPay();
      }
    })
  },
  handleClick: function () {
    wx.switchTab({ url: '/pages/index/index' })
  },
  btnOrderPay: function () {
    utils.orderPay(this.data.orderNumber, '10')
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
    wx.request({
      url: require('../../../config').orderSuccessUrl, //仅为示例，并非真实的接口地址
      method: "get",
      data: {
        order: this.data.orderNumber,
        openid: app.globalData.userInfo.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          order: res.data.obj
        });
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
    wx.request({
      url: require('../../../config').orderSuccessUrl, //仅为示例，并非真实的接口地址
      method: "get",
      data: {
        order: this.data.orderNumber,
        openid: app.globalData.userInfo.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          order: res.data.obj
        });
        wx.stopPullDownRefresh();
      }
    })
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

  }
})