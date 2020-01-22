// pages/mechanism/enter.js
const app = getApp();
const { $Message } = require('../dist/base/index');
var getuserinfo = require('../../utils/getuserinfo.js');
import { $init, $digest } from '../../utils/common.util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var urlsq = currentPage.route; //当前页面url
    getuserinfo.authorize(urlsq);
    $init(this)
  },
  chooseImage: function (e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下9张照片
        this.data.images = images.length <= 1 ? images : images.slice(0, 1)
        $digest(this)
      }
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  formSubmit: function (e) {
    var _this = this;
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
    if (e.detail.value.remarks == null || e.detail.value.remarks == "") {
      $Message({
        content: '请输入机构名称！',
        type: 'error'
      });
      return;
    }
    if (this.data.images.length == 0) {
      $Message({
        content: '请上传相关资质！',
        type: 'error'
      });
      return;
    }

    wx.showToast({
      title: '正在提交...',
      icon: 'loading'
    })

    //将选择的图片组成一个Promise数组，准备进行并行上传
    for (let i = 0; i < this.data.images.length; i++) {
      let path = this.data.images[i];
      wx.uploadFile({
        url: require('../../config').uploadUrl,
        filePath: path,
        name: 'uploadImage',
        success(res) {
          _this.setData({
            arrs: res.data
          });
          if (i + 1 == _this.data.images.length) {
            // 调用保存问题的后端接口
            _this.saveComment({
              openid: app.globalData.userInfo.openid,
              name: e.detail.value.name,
              phone: e.detail.value.phone,
              remarks: e.detail.value.remarks,
              formId: e.detail.formId,
              images: _this.data.arrs
            }
            );
          }
        }
      })
    }
  },
  saveComment: function (data) {
    wx.request({
      url: require('../../config').addJigouRuzhuUrl,
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        if (res.data.r == "1") {
          wx.showToast({
            title: '入驻申请提交成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({ url: '/pages/mechanism/success/success?id=' + res.data.msgs })
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