// pages/buymaterials/comment/comment.js
const app = getApp();
const { $Message } = require('../dist/base/index');
import { $init, $digest } from '../../utils/common.util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemId: 0,
    score: 5,
    images: [],
    arrs:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options.itemId = " + options.itemId);
    this.setData({
      itemId: options.itemId
    })
    $init(this)
  },
  onChange1(e) {
    const index = e.detail.index;
    this.setData({
      'score': index
    })
  },
  chooseImage: function(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下9张照片
        this.data.images = images.length <= 9 ? images : images.slice(0, 9)
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

  },
  btnOrderComment: function (e) {
    var score = e.currentTarget.dataset.score;
    this.setData({
      score: score
    })
  },
  handleClick: function (e) {
    var _this = this;
    if (e.detail.value.content == null || e.detail.value.content == "") {
      $Message({
        content: '请输入您的评论内容！',
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
          console.log(res.data);
          _this.setData({
            arrs: _this.data.arrs + res.data + "#"
          });
          if (i+1 == _this.data.images.length) {
            // 调用保存问题的后端接口
            _this.saveComment({
                openid: app.globalData.userInfo.openid,
                id: _this.data.itemId,
                scoreContent: e.detail.value.content,
                score: _this.data.score,
                formId: e.detail.formId,
                images: _this.data.arrs
              }
            );
          }
        }
      })
    }
    if (_this.data.images.length == 0) {
      console.log("_this.data.itemId = " + _this.data.itemId);
      // 调用保存问题的后端接口
      _this.saveComment({
          openid: app.globalData.userInfo.openid,
          id: _this.data.itemId,
          scoreContent: e.detail.value.content,
          score: _this.data.score,
          formId: e.detail.formId,
          images: _this.data.arrs
        }
      );
    }
    
    
  },
  saveComment: function(data) {
    wx.request({
      url: require('../../config').orderCommenttUrl,
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {
        console.log(res);
        if (res.data.r == "1") {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack();
          }, 300)
        } else {
         
          $Message({
            content: res.data.msgs,
            type: 'error'
          });
        }
      }
    })
  }
})