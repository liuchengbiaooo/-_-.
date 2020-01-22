//app.js
App({
    onLaunch: function() {
        // 展示本地存储能力
        /*var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)*/

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: require('./config').openIdUrl, //仅为示例，并非真实的接口地址
                    data: {
                        code: res.code
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                    },
                    success: res => {
                        //console.log("ggggg", res.data.data.openid)
                        wx.setStorageSync('openid', res.data.data.openid);
                        getApp().globalData.wxCode = res.data.data.openid;
                        //this.getUserInfo();
                    }
                })
            }
        })

    },
    // getUserInfo: function() {
    //   var userinfo = wx.getStorageSync("userinfo");
    //   if (userinfo) {
    //     this.globalData.userInfo = userinfo
    //   } else {
    //     // 获取用户信息
    //     wx.getSetting({
    //       success: res => {
    //         if (res.authSetting['scope.userInfo']) {
    //           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //           wx.getUserInfo({
    //             success: res => {
    //               // 可以将 res 发送给后台解码出 unionId
    //               this.globalData.userInfo = res.userInfo
    //               this.globalData.userInfo["openid"] = this.globalData.openid
    //               this.globalData.userInfo['latitude'] = this.globalData.latitude
    //               this.globalData.userInfo['longitude'] = this.globalData.longitude
    //               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //               // 所以此处加入 callback 以防止这种情况
    //               if (this.userInfoReadyCallback) {
    //                 this.userInfoReadyCallback(res)
    //               }
    //               wx.request({
    //                 url: require('./config').loginUrl, //仅为示例，并非真实的接口地址
    //                 method: "POST",
    //                 data: this.globalData.userInfo,
    //                 header: {
    //                   'content-type': 'application/json' // 默认值
    //                 },
    //                 success: res => {
    //                   console.log(res);
    //                 }
    //               })
    //             }
    //           })
    //         }
    //       }
    //     })
    //   }
    // },
    globalData: {
        userInfo: null,
        wxCode: '', //微信openid
        numberbiao: '', //教师编号
        loginName: '' //教师姓名
    }
})