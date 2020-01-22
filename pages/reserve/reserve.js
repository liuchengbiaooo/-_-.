// pages/reserve/reserve.js
const { $Message } = require('../dist/base/index');
var getuserinfo = require('../../utils/getuserinfo.js');
var utils = require('../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0],
    multiArray:[],
    objectMultiArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var urlsq = currentPage.route; //当前页面url
    getuserinfo.authorize(urlsq);

    
    this.loadCartList();
  },
  
  formSubmit: function (e) {
    if (e.detail.value.name == null || e.detail.value.name == "") {
      $Message({
        content: '请输入联系人姓名！',
        type: 'error'
      });
      return;
    }
    if (e.detail.value.phone == null || e.detail.value.phone == "") {
      $Message({
        content: '请输入联系人手机号码！',
        type: 'error'
      });
      return;
    }

    wx.showToast({
      title: '正在提交...',
      icon: 'loading'
    })
    var kecheng = this.data.multiArray[0][this.data.multiIndex[0]].name + " , " + this.data.multiArray[1][this.data.multiIndex[1]].name;
    wx.request({
      url: require('../../config').addReserveUrl,
      method: "POST",
      data: {
        openid: app.globalData.userInfo.openid,
        reserveType: kecheng,
        name: e.detail.value.name,
        phone:e.detail.value.phone,
        remarks: e.detail.value.remarks,
        formId: e.detail.formId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.r == "1") {
          wx.showToast({
            title: '预约提交成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({ url: '/pages/reserve/success/success?id=' + res.data.msgs })
        } else {
          console.log(res.data.msgs)
          wx.hideToast();
          $Message({
            content: res.data.msgs,
            type: 'error'
          });
        }
      }
    })
  },
  loadCartList: function () {
    console.log(require('../../config').findcascadeUrl);
    wx.request({
      url: require('../../config').findcascadeUrl,
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {

        if (res.data.r == "1") {
          var list = [];
          for (var i = 0; i < res.data.obj.length; i++) {
            list.push(res.data.obj[i].name);
            this.data.objectMultiArray.push(res.data.obj[i].arrays);
            if (i == 0) {
              this.setData({
                "multiArray[1]": res.data.obj[i].arrays
              });
            }
          }
          this.setData({
            "multiArray[0]": res.data.obj,
            objectMultiArray: res.data.obj
          });
          
        }
      }
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1]
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log(e);
    switch (e.detail.column) {
      case 0:
        var list = []
        /*for (var i = 0; i < this.data.objectMultiArray.length; i++) {
          if (this.data.objectMultiArray[i].parid == this.data.objectMultiArray[e.detail.value].regid) {
            list.push(that.data.objectMultiArray[i].regname)
          }
        }*/
        for (var i = 0; i < this.data.objectMultiArray.length; i++) {
          console.log(this.data.objectMultiArray[i].id);
          for (var j = 0; j < this.data.objectMultiArray[i].arrays.length; j++) {
            if (this.data.objectMultiArray[i].arrays[j].paranId == this.data.objectMultiArray[e.detail.value].id) {
              list = this.data.objectMultiArray[i].arrays;
              break;
            }
          }
        }
        console.log(list);
        this.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value,
          "multiIndex[1]": 0
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
    this.loadCartList();
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
    this.loadCartList();
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

  }
})