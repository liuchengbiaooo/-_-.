// pages/account/account.js
var getuserinfo = require('../../utils/getuserinfo.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        hasUserInfo: false,
        pathUrl: "",
        points: '',
        giftTotle: "",
        yuyueNumber: '',
        cardvouchernum: "",
        business: null,
        showDialog: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var pathUrl = currentPage.route; //当前页面url
        this.setData({
            pathUrl: pathUrl
        })
        this.getDatas();
    },
    handleClick: function(e) {
        console.log(this.data.pathUrl);
        getuserinfo.authorize(this.data.pathUrl);
    },

    toggleDialog: function() {
        this.setData({ showDialog: !this.data.showDialog })
    },
    btnPhone: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.business.web_phone
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
        this.getDatas();
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
        //this.getDatas();
        wx.stopPullDownRefresh();
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

    },
    btnSignin: function() {
        wx.navigateTo({
            url: '/pages/points/signin/signin'
        })
    },
    getDatas: function() {
        console.log(app.globalData.userInfo);
        if (app.globalData.userInfo) {
            this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                })
                // wx.request({
                //     url: require('../../config').gettotleUrl, //仅为示例，并非真实的接口地址
                //     method: "get",
                //     data: {
                //         openid: app.globalData.userInfo.openid,
                //     },
                //     header: {
                //         'content-type': 'application/json' // 默认值
                //     },
                //     success: res => {
                //         this.setData({
                //             points: res.data.msgs
                //         });
                //     }
                // })
                // wx.request({
                //     url: require('../../config').getGifttotleUrl, //仅为示例，并非真实的接口地址
                //     method: "get",
                //     data: {
                //         openid: app.globalData.userInfo.openid,
                //     },
                //     header: {
                //         'content-type': 'application/json' // 默认值
                //     },
                //     success: res => {
                //         this.setData({
                //             giftTotle: res.data.msgs
                //         });
                //     }
                // })

            // wx.request({
            //     url: require('../../config').searchReserveUrl, //仅为示例，并非真实的接口地址
            //     header: {
            //         'content-type': 'application/json' // 默认值
            //     },
            //     method: "GET",
            //     data: {
            //         pn: 1,
            //         openid: app.globalData.userInfo.openid
            //     },
            //     success: resp => {
            //         wx.hideNavigationBarLoading();
            //         if (resp.data.r == "1") {
            //             this.setData({
            //                 yuyueNumber: resp.data.obj.totalRecords,
            //             })

            //         }
            //     }
            // })

            // wx.request({
            //     url: require('../../config').findbusinessUrl,
            //     method: "get",
            //     header: {
            //         'content-type': 'application/json' // 默认值
            //     },
            //     success: res => {
            //         console.log(res);
            //         this.setData({
            //             business: res.data
            //         });
            //     }
            // })

            // wx.request({
            //     url: require('../../config').personMycardvoucherUrl,
            //     header: {
            //         'content-type': 'application/json' // 默认值
            //     },
            //     method: "GET",
            //     data: {
            //         pn: 1,
            //         openid: app.globalData.userInfo.openid
            //     },
            //     success: resp => {
            //         wx.hideNavigationBarLoading();
            //         console.log(resp);
            //         if (resp.data.r == "1") {
            //             if (resp.data.obj.totalRecords > 0) {
            //                 this.setData({ cardvouchernum: resp.data.obj.totalRecords })
            //             }
            //         }
            //     }
            // })
        }
    }
})