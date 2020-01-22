// pages/gift/detail/gift-detail.js
var WxParse = require('../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftId:0,
    gift: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var giftId = options.giftId;
    this.setData({
      giftId: giftId
    })
    this.loadDatas();
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
    this.loadDatas();
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
    this.loadDatas();
    wx.stopPullDownRefresh();
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
  btnExchange: function() {
    wx.navigateTo({
      url: '/pages/gift/exchange/exchange?giftId=' + this.data.giftId,
    })
  },
  loadDatas: function() {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: require('../../../config').detailGiftUrl + "/" + this.data.giftId, //仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        wx.hideNavigationBarLoading();
        this.setData({
          gift: res.data
        });
        WxParse.wxParse('content', 'html', res.data.description, that, 5);
        wx.setNavigationBarTitle({
          title: res.data.giftName
        })
      }
    })
  }
})