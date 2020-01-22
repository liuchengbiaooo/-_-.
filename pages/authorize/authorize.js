// pages/authorize/authorize.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPages:'',

    motto: '您当前的操作需要授权',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  cancelAuthorize:function() {

    if ("pages/account/account" == this.data.currentPages || "pages/order/view/order-list" == this.data.currentPages || "pages/index/index" == this.data.currentPages) {
      wx.switchTab({ url: '/' + this.data.currentPages })
    } else {
      wx.navigateBack();
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.merchant == null || options.merchant == undefined) {
      this.setData({
        currentPages: options.currentPages
      })
    } else {
      this.setData({
        currentPages: options.currentPages + "?merchant=" + options.merchant
      })
    }
    
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
   
    console.log(app.globalData.openid)
    if ('getUserInfo:ok' == e.detail.errMsg) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.userInfo["openid"] = app.globalData.openid
      app.globalData.userInfo['latitude'] = app.globalData.latitude
      app.globalData.userInfo['longitude'] = app.globalData.longitude
      
      wx.request({
        url: require('../../config').loginUrl, //仅为示例，并非真实的接口地址
        method: "POST",
        data: app.globalData.userInfo,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          wx.setStorageSync("userinfo", res.data.obj)
          if ("pages/account/account" == this.data.currentPages || "pages/order/view/order-list" == this.data.currentPages || "pages/index/index" == this.data.currentPages) {
            wx.switchTab({ url: '/' + this.data.currentPages })
          } else {
            wx.redirectTo({ url: '/' + this.data.currentPages })
          }
        }
      })
    }
    
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
  
  }
})