// pages/shpto/shpto.js
var getuserinfo = require('../../utils/getuserinfo.js');
var utils = require('../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shiptos: null,
    remainCreateShiptoCount: 0,
    showPage: false,
    typeshpto:'10'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var urlsq = currentPage.route; //当前页面url
    getuserinfo.authorize(urlsq);
    
    this.setData({
      typeshpto: options.typeshpto
    })

    wx.authorize({ scope: "scope.userLocation" })
    wx.request({
      url: require('../../config').cartShptoListUrl + "?openid=" + app.globalData.userInfo.openid,
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          shiptos: res.data.obj,
          remainCreateShiptoCount: parseInt(res.data.msgs)
        });
        if (res.data.obj == null || res.data.obj.length <= 0) {
          this.setData({ showPage: true })
        } else {
          this.setData({ showPage: false })
        }
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
    wx.request({
      url: require('../../config').cartShptoListUrl + "?openid=" + app.globalData.userInfo.openid,
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          shiptos: res.data.obj,
          remainCreateShiptoCount: parseInt(res.data.msgs)
        });
        if (res.data.obj == null || res.data.obj.length <= 0) {
          this.setData({ showPage: true })
        } else {
          this.setData({ showPage: false })
        }
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
      url: require('../../config').cartShptoListUrl + "?openid=" + app.globalData.userInfo.openid,
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        this.setData({
          shiptos: res.data.obj,
          remainCreateShiptoCount: parseInt(res.data.msgs)
        });
        if (res.data.obj == null || res.data.obj.length <= 0) {
          this.setData({ showPage: true })
        } else {
          this.setData({ showPage: false })
        }
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

  },
  btnAddAddress: function () {
    wx.navigateTo({
      url: '/pages/shpto-form/shpto-form?shpitoId=0&typeshpto=' + this.data.typeshpto,
    })
  },
  btnEditAddress: function (e) {

    wx.navigateTo({
      url: '/pages/shpto-form/shpto-form?shpitoId=' + e.currentTarget.dataset.id + "&typeshpto=" + this.data.typeshpto,
    })
  },
  radioChange: function (e) {

    wx.showToast({
      title: "loading",
      icon: "loading",
      duration: 5000
    })
    wx.request({
      url: require('../../config').shptoDefaultUrl,
      method: "get",
      data: {
        openid: app.globalData.userInfo.openid,
        shiptoId: e.detail.value
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.r == "1") {
          wx.hideToast();
          wx.redirectTo({ url: '/pages/sell/checkout/checkout'})
        }
      }
    })
  },
  btnDeleteAddress: function (e) {
    wx.request({
      url: require('../../config').shptoDeleteUrl,
      method: "POST",
      data: {
        openid: app.globalData.userInfo.openid,
        shiptoId: e.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.r == "1") {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          this.onLoad();
        } else {
          wx.showModal({
            title: "提示",
            content: "删除失败" + res.data.msgs,
            showCancel: false,
            confirmText: "确定"
          })
        }
      }
    })
  }
})