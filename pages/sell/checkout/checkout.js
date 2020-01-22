// pages/order/checkout/checkout.js
const { $Message } = require('../../dist/base/index');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taiNumber: '',
    cart: null,
    isvoucher: false,
    voucher: null,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLoadDatas();
  },

  formSubmit: function (e) {
    var _this = this;
    if (_this.data.cart.shipto == null) {
      wx.showModal({
        content: "您还没有收餐地址，现在去添加",
        confirmText: "确定",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/shpto/shpto?merchantId=' + _this.data.merchantId
            })
          }
        }
      })
      return;
    }
    if (!_this.data.cart.rangesa) {
      wx.showModal({
        content: "您的地址超出了配送范围，您可以更换地址",
        confirmText: "去更换",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/shpto/shpto?merchantId=' + _this.data.merchantId
            })
          }
        }
      })
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
      url: require('../../../config').orderSubmitUrl,
      method: "POST",
      data: {
        openid: app.globalData.userInfo.openid,
        cartType: "20",
        taiNumber: this.data.taiNumber,
        remark: e.detail.value.remark,
        cardId: cardId,
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
          wx.redirectTo({ url: '/pages/sell/order-success/order-success?orderNumber=' + res.data.msgs })
        } else {
          wx.hideToast();
          $Message({
            content: res.data.msgs,
            type: 'error'
          });
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
    this.getLoadDatas();
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
    this.getLoadDatas();
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
  getLoadDatas: function(){
    wx.request({
      url: require('../../../config').cartCheckoutUrl + "?openid=" + app.globalData.userInfo.openid + "&cartType=20",
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.r == "1") {
          this.setData({
            cart: res.data.obj
          });
          this.getMyCardVoucher()
        }
      }
    })
  },
  getMyCardVoucher: function () {
    wx.request({
      url: require('../../../config').mycardvoucherUrl,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      data: {
        totalAmount: this.data.cart.totalAmount,
        openid: app.globalData.userInfo.openid
      },
      success: resp => {
        if (resp.data.r == "1") {
          this.setData({
            voucher: resp.data.obj,
          })
          if (resp.data.obj.length > 0) {
            this.setData({ isvoucher: true })
          } else {
            this.setData({ isvoucher: false })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: resp.data.msgs,
            showCancel: false,
            success: function (res) {
            }
          })
        }
      }
    })
  },
  bindRegionChange(e) {
    this.setData({
      index: e.detail.value
    })
  }
})