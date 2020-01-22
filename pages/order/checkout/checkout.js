// pages/order/checkout/checkout.js
const { $Message } = require('../../dist/base/index');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        taiNumber: '',
        cart: null,
        isvoucher: false,
        voucher: null,
        index: 0,
        aggregate: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getLoadDatas();
    },

    btnQRCode: function() {
        var _this = this;
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                console.log(res)
                if (res.path == null) {
                    $Message({
                        content: '扫码出错了！',
                        type: 'error'
                    });
                    return;
                }
                var taiNumber = res.path.substring(28, res.path.length);
                wx.setStorageSync('number', taiNumber)
                _this.setData({
                    taiNumber: taiNumber
                })
            },
            fail(res) {
                $Message({
                    content: '扫码出错了！',
                    type: 'error'
                });
            }
        })
    },

    formSubmit: function(e) {
        if (e.detail.value.name == null || e.detail.value.name == "") {
            $Message({
                content: '请输入您的姓名！',
                type: 'error'
            });
            return;
        }
        if (e.detail.value.phone == null || e.detail.value.phone == "") {
            $Message({
                content: '请输入您的手机号码！',
                type: 'error'
            });
            return;
        }
        // var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        // if (e.detail.value.phone != '11' || !myreg.test(e.detail.value.phone)) {
        //     wx.showModal({
        //         title: '温馨提示',
        //         content: '手机号输入有误',
        //         showCancel: false
        //     })
        //     return
        // }


        // wx.showToast({
        //     title: '正在提交...',
        //     icon: 'loading'
        // })
        var cardId = 0;
        if (this.data.isvoucher) {
            cardId = this.data.voucher[this.data.index].id;
        }

        wx.request({
            url: require('../../../config').queryStudents,
            method: "POST",
            data: {
                userId: getApp().globalData.userInfo.id, //用户id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                let result = res.data.data;
                console.log("FAsgasg", result)
                if (result.length == 0) {
                    wx.showModal({
                        title: '温馨提示',
                        content: '请您绑定学生ID',
                        showCancel: true,
                        success(res) {
                            if (res.confirm) {
                                wx.redirectTo({ url: '/pages/bindingID/bindingID' })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else {
                    console.log("有")
                    let stuId = result[0].stuTeaId;
                    wx.request({
                        url: require('../../../config').orderSubmitUrl,
                        method: "POST",
                        data: {
                            userId: getApp().globalData.userInfo.id, //用户id
                            enlistName: e.detail.value.name,
                            stuId: stuId,
                            enlistPhone: e.detail.value.phone,
                            remark: e.detail.value.remark
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: res => {
                            console.log("执行", res)

                            wx.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000
                            })
                            wx.redirectTo({ url: '/pages/order/order-success/order-success?form=' + JSON.stringify(res.data.data) })
                        }
                    })
                }
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
        //this.getLoadDatas();
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
        this.getLoadDatas();
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
    getLoadDatas: function() {
        // var taiNumber = wx.getStorageSync("number");
        // this.setData({
        //   taiNumber: taiNumber
        // })

        // wx.request({
        //   url: require('../../../config').cartCheckoutUrl + "?openid=" + app.globalData.userInfo.openid + "&cartType=10",
        //   method: "get",
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   success: res => {
        //     if (res.data.r == "1") {
        //       this.setData({
        //         cart: res.data.obj
        //       });
        //       this.getMyCardVoucher()
        //     }
        //   }
        // })
        let userId = getApp().globalData.userInfo.id; //用户id
        wx.request({
            url: require('../../../config').cartListUrl,
            method: "post",
            data: {
                userId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                console.log(res)
                let cart = res.data.data;
                // var how = 0; //购物车总数量
                var aggregate = 0; //购物车金额
                for (var i = 0; i < cart.length; i++) {
                    //console.log("购物车", parseFloat(cart[i].price))
                    aggregate += parseFloat(cart[i].price) * parseFloat(cart[i].num);
                    cart[i].total = parseFloat(cart[i].price) * parseFloat(cart[i].num);
                }
                // console.log("购物车", res.data.data, how, aggregate)
                this.setData({
                    cart,
                    aggregate
                });


            }
        })

    },
    getMyCardVoucher: function() {
        wx.request({
            url: require('../../../config').mycardvoucherUrl,
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                totalAmount: this.data.cart.totalAmount,
                openid: app.globalData.userInfo.openid
            },
            success: resp => {
                if (resp.data.r == "1") {
                    this.setData({
                        voucher: resp.data.obj,
                    })
                    if (resp.data.obj.length > 0) {
                        this.setData({ isvoucher: true })
                    } else {
                        this.setData({ isvoucher: false })
                    }
                } else {
                    wx.showModal({
                        title: '提示',
                        content: resp.data.msgs,
                        showCancel: false,
                        success: function(res) {}
                    })
                }
            }
        })
    },
    bindRegionChange(e) {
        this.setData({
            index: e.detail.value
        })
    }
})