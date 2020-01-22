var WxParse = require('../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: '',
        curriculum: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        this.setData({
            type: "2"
        })
        wx.request({
            url: require('../../config').interestStudies, //仅为示例，并非真实的接口地址
            method: "get",
            data: {
                type: this.data.type
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                let result = res.data.data[0].info
                WxParse.wxParse('content', 'html', result, that, 5);
                // wx.setNavigationBarTitle({
                //     title: res.data.data.title
                // })
            }
        })
    },
    // //返回首页
    // originally: function() {
    //     wx.switchTab({
    //         url: '../index/index',
    //     })
    // },
    //查看课程详情
    viewDetails: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/courseParticulars/courseParticulars?key=' + id
        })
    },
    //转化时间
    getLocalTime: function(str) {
        var oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSec = oDate.getSeconds();
        var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSec);
        return oTime;
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
})