// pages/order/order-success/order-success.js
var utils = require('../../../utils/util.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let order = JSON.parse(options.form)
        this.setData({
            order
        })
    },
    handleClick: function() {
        wx.switchTab({ url: '/pages/index/index' })
    },
    //支付
    btnOrderPay: function() {
        let openId = getApp().globalData.userInfo.openId
        wx.request({
            url: require('../../../config').paymentMoney,
            method: "post",
            data: {
                openid: openId,
                payNum: this.data.order.price * 100,
                //payNum: 10,
                enlistId: this.data.order.enlistId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                utils.orderPay(res.data.data)
            }
        })

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
        // wx.request({
        //     url: require('../../../config').orderSuccessUrl, //仅为示例，并非真实的接口地址
        //     method: "get",
        //     data: {
        //         order: this.data.orderNumber,
        //         openid: app.globalData.userInfo.openid
        //     },
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: res => {
        //         console.log(res);
        //         this.setData({
        //             order: res.data.obj
        //         });
        //     }
        // })
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
        // wx.request({
        //     url: require('../../../config').orderSuccessUrl, //仅为示例，并非真实的接口地址
        //     method: "get",
        //     data: {
        //         order: this.data.orderNumber,
        //         openid: app.globalData.userInfo.openid
        //     },
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: res => {
        //         console.log(res);
        //         this.setData({
        //             order: res.data.obj
        //         });
        //         wx.stopPullDownRefresh();
        //     }
        // })
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