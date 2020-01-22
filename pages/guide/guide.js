// pages/guide/guide.js
let self
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isChecked: true,
        type: ""
    },

    // 是否同意协议
    checkboxChange(e) {
        let isChecked = !self.data.isChecked
        self.setData({
            isChecked
        })
    },
    // 授权 获取用户微信信息 登录
    getUserInfo(e) {

        let type = e.target.dataset.login;
        self.setData({
            type
        })
        wx.setStorage({
            key: 'user_key',
            data: 'login',
        })

        if (!self.data.isChecked) {
            // 未同意时
            wx.showModal({
                title: '温馨提示',
                content: '请阅读并同意用户使用协议',
                showCancel: false
            })
        }
        console.log(e)
        if (e.detail.userInfo && self.data.isChecked) {
            console.log("SSSS")
                //getApp().globalData.userInfo["openid"] = getApp().globalData.openid
                // getApp().globalData.userInfo['latitude'] = getApp().globalData.latitude
                //getApp().globalData.userInfo['longitude'] = getApp().globalData.longitude;
            let openId = getApp().globalData.wxCode;
            let imgUrl = e.detail.userInfo.avatarUrl;
            let nickName = e.detail.userInfo.nickName;
            let city = e.detail.userInfo.province;
            //console.log("执行", openId, imgUrl, nickName, city)
            wx.request({
                url: require('../../config').loginUrl, //仅为示例，并非真实的接口地址
                method: "POST",
                data: { openId, imgUrl, nickName, city },
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: res => {
                    getApp().globalData.userInfo = res.data.data;
                    if (e.detail.userInfo && self.data.isChecked) {
                        if (self.data.type == "patriarch") {
                            let result = res.data.data;
                            wx.request({
                                url: require('../../config').queryStudents,
                                method: "POST",
                                data: {
                                    userId: result.id, //用户id
                                },
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                                },
                                success: res => {
                                    let resly = res.data.data
                                    if (resly.length == 0) {
                                        wx.redirectTo({ url: '/pages/bindingID/bindingID' })
                                    } else {
                                        wx.switchTab({
                                            url: '../index/index',
                                        })
                                    }
                                }
                            })
                        } else if (self.data.type == "teacher") {
                            let openId = getApp().globalData.wxCode;
                            wx.request({
                                url: require('../../config').teacherBianHao,
                                method: "POST",
                                data: {
                                    openId: openId, //用户id
                                },
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                                },
                                success: res => {
                                    let code = res.data.code;
                                    if (code == 0) {
                                        wx.redirectTo({
                                            url: '/pages/bindingIDTwo/bindingIDTwo'
                                        })
                                    } else if (code == 500) {
                                        wx.redirectTo({
                                            url: '/pages/teacherLogin/teacherLogin'
                                        })
                                    }
                                }
                            })

                        }
                    }

                }
            })
        }
        return
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this
            // 登录
            // wx.login({
            //     success: res => {
            //         console.log("res", res)
            //             //发送 res.code 到后台换取 openId, sessionKey, unionId
            //             //发送 res.code 到后台换取 openId, sessionKey, unionId
            //         wx.request({
            //             url: require('../../config').openIdUrl, //仅为示例，并非真实的接口地址
            //             data: {
            //                 jscode: res.code
            //             },
            //             header: {
            //                 'content-type': 'application/json' // 默认值
            //             },
            //             success: res => {
            //                 wx.setStorageSync('openid', res.data.openid);
            //                 //self.globalData.openid = res.data.openid;
            //                 console.log("sfgg", res.data.openid)
            //             }
            //         })
            //     }
            // })
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