// pages/order/view/order-list.js
var getuserinfo = require('../../../utils/getuserinfo.js');
var utils = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: null,
    totalPageNum: 0,    // 总页数
    currentPage: 1,  // 当前页数  默认是1
    showPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var urlsq = currentPage.route; //当前页面url
    getuserinfo.authorize(urlsq);
    this.loadOrderList();
  },
  loadOrderList: function () {
    wx.showNavigationBarLoading();
    wx.request({
      url: require('../../../config').orderSearchListUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      data: {
        pn: 1,
        cartType: "20",
        openid: app.globalData.userInfo.openid
      },
      success: resp => {
        wx.hideNavigationBarLoading();
        if (resp.data.r == "1") {
          this.setData({
            orders: resp.data.obj.datas,
            totalPageNum: resp.data.obj.pgm.totalPageNum,
            currentPage: 1
          })
          if (resp.data.obj.totalRecords <= 0) {
            this.setData({ showPage: true })
          } else {
            this.setData({ showPage: false })
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

  btnOrderComment: function (e) {
    var order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '/pages/order-comment/order-comment?orderNum=' + order,
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
    this.loadOrderList();
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
    this.loadOrderList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    console.log(self.data.totalPageNum + " , " + self.data.currentPage);
    // 当前页是最后一页
    if (self.data.currentPage >= self.data.totalPageNum) {
      return;
    }
    wx.showNavigationBarLoading();
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    var tempCurrentPage = self.data.currentPage;
    tempCurrentPage = tempCurrentPage + 1;
    self.setData({
      currentPage: tempCurrentPage,
    })

    wx.request({
      url: require('../../../config').orderSearchListUrl, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      data: {
        pn: self.data.currentPage,
        cartType: "20",
        openid: app.globalData.userInfo.openid
      },
      success: resp => {
        var tempArray = self.data.orders;
        tempArray = tempArray.concat(resp.data.obj.datas);
        this.setData({
          orders: tempArray,
          totalPageNum: resp.data.obj.pgm.totalPageNum,
        })
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  btnOrderDetail: function (e) {
    var order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?orderNum=' + order,
    })
  },
  btnCart: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  btnOrderPay: function (e) {
    var order = e.currentTarget.dataset.order;
    utils.orderPay(order, '20')
  },
  btnCancelOrder: function (e) {
    var order = e.currentTarget.dataset.order;
    var index = e.currentTarget.dataset.index;
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
            url: require('../../../config').orderCanceltUrl + "/" + order, //仅为示例，并非真实的接口地址
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
                  ['orders[' + index + '].orderStatus']: '交易关闭',
                  ['orders[' + index + '].status']: false
                })
              }
            }
          })
        }
      }
    })
  }
})