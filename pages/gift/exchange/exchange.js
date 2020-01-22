// pages/gift/exchange/exchange.js
const { $Message } = require('../../dist/base/index');
var getuserinfo = require('../../../utils/getuserinfo.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftId: 0,
    gift: null,
    points: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var giftId = options.giftId;
    this.setData({
      giftId: giftId
    })

    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var merchantId = options.merchant;
    var urlsq = currentPage.route + "&giftId=" + giftId; //当前页面url
    getuserinfo.authorize(urlsq);

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
  formSubmit: function (e) {
    console.log(e);
    if (e.detail.value.contactName == null || e.detail.value.contactName == "") {
      $Message({
        content: '请输入您的联系人姓名！',
        type: 'error'
      });
      return;
    }
    if (e.detail.value.mobile == null || e.detail.value.mobile == "") {
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
    console.log(e.detail.formId);

    wx.request({
      url: require('../../../config').confirmSubmitGiftUrl,
      method: "POST",
      data: {
        openid: app.globalData.userInfo.openid,
        contactName: e.detail.value.contactName,
        mobile: e.detail.value.mobile,
        giftId: this.data.giftId,
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
          wx.redirectTo({ url: '/pages/gift/success/success?name=' + this.data.gift.giftName + "&exchNumber=" + res.data.msgs})
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
  loadDatas: function () {
    wx.showNavigationBarLoading();
    wx.request({
      url: require('../../../config').gettotleUrl, //仅为示例，并非真实的接口地址
      method: "get",
      data: {
        openid: app.globalData.userInfo.openid,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        this.setData({
          points: res.data.msgs
        });
      }
    })
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
      }
    })
  }
})