// pages/order/view/order-list.js
var getuserinfo = require('../../../utils/getuserinfo.js');
var utils = require('../../../utils/util.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        current: 0,
        orders: null,
        totalPageNum: 0, // 总页数
        currentPage: 1, // 当前页数  默认是1
        orderStatus: "",
        showPage: false,
        type: 0 //全部课程type=0 ;待学课程 type=1 ;待评价课程 type=2;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var urlsq = currentPage.route; //当前页面url
        getuserinfo.authorize(urlsq);
        // this.loadOrderList();
    },
    //查询课程列表
    loadOrderList: function() {
        //console.log("G|Aga")
        // wx.showNavigationBarLoading();

        //用户订单详情
        let userId = getApp().globalData.userInfo.id; //用户id
        wx.request({
                url: require('../../../config').userorderForm, //仅为示例，并非真实的接口地址
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                method: "post",
                data: {
                    userId: userId,
                    type: this.data.type
                },
                success: res => {
                    let result = res.data.data;
                    if (res.data.data.length > 0) {
                        result.forEach(item => {
                            item.amountSum = item.num * item.price
                        })
                    }
                    if (result.length == 0) {
                        this.setData({ showPage: true })
                    } else {
                        this.setData({ showPage: false })
                    }
                    this.setData({
                        orders: result,
                        //totalPageNum: resp.data.obj.pgm.totalPageNum,
                        //currentPage: 1
                    })
                }
            })
            // wx.request({
            //   url: require('../../../config').orderSearchListUrl, //仅为示例，并非真实的接口地址
            //   header: {
            //     'content-type': 'application/json' // 默认值
            //   },
            //   method: "GET",
            //   data: {
            //     pn: 1,
            //     orderStatus: this.data.orderStatus,
            //     openid: app.globalData.userInfo.openid
            //   },
            //   success: resp => {
            //     wx.hideNavigationBarLoading();
            //     if (resp.data.r == "1") {
            //       this.setData({
            //         orders: resp.data.obj.datas,
            //         totalPageNum: resp.data.obj.pgm.totalPageNum,
            //         currentPage: 1
            //       })
            //       if (resp.data.obj.totalRecords <= 0) {
            //         this.setData({ showPage: true })
            //       } else {
            //         this.setData({ showPage: false })
            //       }
            //     } else {
            //       wx.showModal({
            //         title: '提示',
            //         content: resp.data.msgs,
            //         showCancel: false,
            //         success: function (res) {

        //         }
        //       })
        //     }
        //   }
        // })
        // wx.request({
        //   url: require('../../../config').findOrderNumberltUrl, 
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   method: "GET",
        //   data: {
        //     orderStatus: "10",
        //     openid: app.globalData.userInfo.openid
        //   },
        //   success: resp => {
        //     if (resp.data.r == "1") {
        //       this.setData({
        //         daiOrderNumber: resp.data.msgs
        //       })
        //     } 
        //   }
        // })


        // wx.request({
        //   url: require('../../../config').findOrderNumberltUrl,
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   method: "GET",
        //   data: {
        //     orderStatus: "40",
        //     openid: app.globalData.userInfo.openid
        //   },
        //   success: resp => {
        //     if (resp.data.r == "1") {
        //       this.setData({
        //         daiOrderPingNumber: resp.data.msgs
        //       })
        //     }
        //   }
        // })
    },
    handleChange({ detail }) {
        let type = detail.key;
        this.setData({
            type: type,
            current: detail.key,
            //orderStatus: detail.key
        });
        this.loadOrderList();
    },
    btnOrderComment: function(e) {
        var order = e.currentTarget.dataset.order;
        wx.navigateTo({
            url: '/pages/order-comment/order-comment?itemId=' + order,
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
        this.loadOrderList();
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
        // this.loadOrderList();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        // var self = this;
        // console.log(self.data.totalPageNum + " , " + self.data.currentPage);
        // // 当前页是最后一页
        // if (self.data.currentPage >= self.data.totalPageNum) {
        //     return;
        // }
        // wx.showNavigationBarLoading();
        // wx.showToast({
        //     title: 'loading...',
        //     icon: 'loading'
        // })
        // var tempCurrentPage = self.data.currentPage;
        // tempCurrentPage = tempCurrentPage + 1;
        // self.setData({
        //     currentPage: tempCurrentPage,
        // })

        // wx.request({
        //     url: require('../../../config').orderSearchListUrl, //仅为示例，并非真实的接口地址
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     method: "GET",
        //     data: {
        //         pn: self.data.currentPage,
        //         orderStatus: self.data.orderStatus,
        //         openid: app.globalData.userInfo.openid
        //     },
        //     success: resp => {
        //         var tempArray = self.data.orders;
        //         tempArray = tempArray.concat(resp.data.obj.datas);
        //         this.setData({
        //             orders: tempArray,
        //             totalPageNum: resp.data.obj.pgm.totalPageNum,
        //         })
        //         wx.hideNavigationBarLoading();
        //         wx.hideToast();
        //     }
        // })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    btnOrderDetail: function(e) {
        var order = e.currentTarget.dataset.order;
        wx.navigateTo({
            url: '/pages/order-detail/order-detail?orderNum=' + order,
        })
    },
    btnCart: function() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    //报名缴费
    btnOrderPay: function(e) {
        console.log('e.currentTarget.dataset', e.currentTarget.dataset)
        let openId = getApp().globalData.userInfo.openId;
        let enlistId = e.currentTarget.dataset.enlistid;
        let payNum = e.currentTarget.dataset.price * e.currentTarget.dataset.num * 100;
        wx.request({
            url: require('../../../config').paymentMoney,
            method: "post",
            data: {
                openid: openId,
                payNum: payNum,
                //payNum: 10,
                enlistId: enlistId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                console.log("Res", res)
                utils.orderPay(res.data.data, this.loadOrderList)
            }
        })
    },
    //取消订单
    btnCancelOrder: function(e) {
        console.log("取消", e.currentTarget.dataset)
        let enlistId = e.currentTarget.dataset.enlistid;
        let userId = e.currentTarget.dataset.userid;
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您确定取消订单吗？',
            success: function(res) {
                if (res.confirm) {
                    wx.showToast({
                        title: '处理中...',
                        icon: 'loading'
                    })
                    wx.request({
                        url: require('../../../config').orderCanceltUrl,
                        header: {
                            'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        method: "post",
                        data: {
                            id: enlistId,
                            userId: userId
                        },
                        success: res => {

                            that.loadOrderList();

                            // if (resp.data.r == "1") {
                            //     wx.hideToast();
                            //     // _this.setData({
                            //     //     ['orders[' + index + '].orderStatus']: '交易关闭',
                            //     //     ['orders[' + index + '].status']: false
                            //     // })
                            // }
                            // wx.request({
                            //     url: require('../../../config').findOrderNumberltUrl,
                            //     header: {
                            //         'content-type': 'application/json' // 默认值
                            //     },
                            //     method: "GET",
                            //     data: {
                            //         orderStatus: "10",
                            //         openid: app.globalData.userInfo.openid
                            //     },
                            //     success: resp => {
                            //         if (resp.data.r == "1") {
                            //             _this.setData({
                            //                 daiOrderNumber: resp.data.msgs
                            //             })
                            //         }
                            //     }
                            // })
                        }

                    })
                }
            }
        })
    }
})