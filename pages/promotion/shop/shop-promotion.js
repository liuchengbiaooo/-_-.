// pages/promotion/shop/shop-promotion.js
var getuserinfo = require('../../../utils/getuserinfo.js');
const { $Message } = require('../../dist/base/index');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionId: 0,
    promotions: null,
    number:1
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
  handleChange1({ detail }) {
    this.setData({
      number: detail.value
    })
  },
  btnReturn: function() {
    wx.navigateBack({
      chandeg: true
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
        
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }
    })

  },
  formSubmit: function (e) {
    if (e.detail.value.name == null || e.detail.value.name == "") {
      $Message({
        content: '请输入您的姓名！',
        type: 'error'
      });
      return;
    }
    if (e.detail.value.phone == null || e.detail.value.phone == "") {
      $Message({
        content: '请输入您的手机号码！',
        type: 'error'
      });
      return;
    }
    wx.showToast({
      title: '正在提交...',
      icon: 'loading'
    })
    var cardId = 0;
    if (this.data.isvoucher) {
      cardId = this.data.voucher[this.data.index].id;
    }

    wx.request({
      url: require('../../../config').promotionSubmitUrl,
      method: "POST",
      data: {
        openid: app.globalData.userInfo.openid,
        promotionId: this.data.promotionId,
        number: this.data.number,
        name: e.detail.value.name,
        phone: e.detail.value.phone,
        formId: e.detail.formId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        if (res.data.r == "1") {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({ url: '/pages/promotion/order-success/order-success?orderNumber=' + res.data.msgs })
        } else {
          wx.hideToast();
          $Message({
            content: res.data.msgs,
            type: 'error'
          });
        }
      }
    })
  }
})