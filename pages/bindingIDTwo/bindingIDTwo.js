let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numberbiao: '',
    loginName: ''
  },
  back_houtai(e) {
    const val = e.detail.value
    const data = {
      name: val.name,
      number: val.number,
      identity: val.identity,
    }
    this.data.numberbiao = data.number;
    this.data.loginName = data.name;
    const dataArr = Object.values(data)
    for (let val of dataArr) { //验证
      if (!val) {
        wx.showModal({
          title: '温馨提示',
          content: '请输入正确的账号信息',
          showCancel: false
        })
        return
      }
    }
    getApp().globalData.numberbiao = this.data.numberbiao;
    getApp().globalData.loginName = this.data.loginName;
    let userId = getApp().globalData.userInfo.id; //用户id
    console.log("sssss", getApp().globalData.numberbiao, getApp().globalData.loginName)
    wx.request({
      url: require('../../config').bindingTeacher,
      method: "post",
      data: {
        userId: userId,
        teacherNo: data.number,
        name: data.name,
        idcard: data.identity
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: res => {

        let code = res.data.code;
        if (code == 500) {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false,
            success: function(res) {

            }
          })
        } else if (code == 0) {
          wx.redirectTo({
            url: '/pages/teacherLogin/teacherLogin'
          })
        }
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
});