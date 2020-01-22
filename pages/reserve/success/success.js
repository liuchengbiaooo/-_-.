// pages/reserve/success/success.js
var utils = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reserveId:0,
    reserve:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var reserveId = options.id;
    this.setData({
      reserveId: reserveId
    })
    wx.request({
      url: require('../../../config').reserveUrl + "/" + reserveId, //仅为示例，并非真实的接口地址
      method: "get",
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        this.setData({
          reserve: res.data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  handleClick: function () {
    wx.switchTab({ url: '/pages/index/index' })
  },
  btnOrderPay: function () {
    wx.switchTab({ url: '/pages/account/account' })
  },
  btnReserveOrderPay: function() {
    utils.orderPay(this.data.reserve.orderNumber, '30')
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

  }
})