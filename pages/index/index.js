const { $Toast } = require('../dist/base/index');
var getuserinfo = require('../../utils/getuserinfo.js');
const app = getApp();
var amapFile = require('../../utils/amap-wx.js');

Page({
    data: {
        banners: [],
        business: null,
        categorys: [],
        //是否采用衔接滑动  
        circular: true,
        //是否显示画板指示点  
        indicatorDots: true,
        indicatorPrsDots: false,
        //选中点的颜色  
        indicatorcolor: "#000",
        //是否竖直  
        vertical: false,
        //是否自动切换  
        autoplay: true,
        //自动切换的间隔
        interval: 5000,
        //滑动动画时长毫秒  
        duration: 100,
        //所有图片的高度
        imgheights: [],
        imgPromsheights: [],
        imgheightMenus: [],
        imgheightGitss: [],
        //图片宽度 
        imgwidth: 750,
        addressName: "加载中...",
        //默认  
        current: 0,
        currentProms: 0,
        currentMune: 0,
        currentGits: 0,
        hasUserInfo: false,
        showDialog: false,
        newbaoming: "",
        tabcurrent: '10',
        totalcarPageNum: 0,
        currentPage: 1, // 当前页数  默认是1
    },
    onLoad: function(options) {
        console.log("ssss", options);
        //var fxopenid = options.openid;
        // if ((fxopenid != undefined)) {
        //     var uuids = options.uuids;
        //     wx.request({
        //         url: require('../../config').addCardVoucherUrl,
        //         method: "POST",
        //         data: {
        //             cardId: 4,
        //             openid: fxopenid,
        //             uuids: uuids
        //         },
        //         header: {
        //             'content-type': 'application/x-www-form-urlencoded' // 默认值
        //         },
        //         success: res => {
        //             if (res.data.r == "1") {}
        //         }
        //     })
        // }
        var that = this;
        var myAmapFun = new amapFile.AMapWX({ key: '158913e076ad8c5719e2d5579eb1a778' });
        myAmapFun.getRegeo({
            success: data => {
                console.log(data);
                app.globalData.latitude = data[0].latitude;
                app.globalData.longitude = data[0].longitude;
                //成功回调
                this.setData({
                        latitude: data[0].latitude,
                        longitude: data[0].longitude,
                        addressName: data[0].name
                    })
                    // this.getDataPageOne();
            },
            fail: function(info) {
                //失败回调
                console.log("高德定位" + info);
            }
        })

        wx.request({
            url: require('../../config').bannerUrl,
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                this.setData({
                    banners: res.data.data
                })
            }
        })

        // wx.request({
        //     url: require('../../config').findTodayCourseNewUrl,
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: res => {
        //         that.loadNewBaoming(res.data.obj);
        //     }
        // })
        this.getData();
    },
    handleChange({ detail }) {
        this.setData({
            tabcurrent: detail.key
        });
    },
    imageLoad: function(e) { //获取图片真实宽度  
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比  
            ratio = imgwidth / imgheight;
        //计算的高度值  
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        var imgheights = this.data.imgheights;
        //把每一张图片的对应的高度记录到数组里  
        imgheights[e.target.dataset.id] = imgheight;
        this.setData({
            imgheights: imgheights
        })
    },
    imageGitsLoad: function(e) { //获取图片真实宽度  
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比  
            ratio = imgwidth / imgheight;
        //计算的高度值  
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        var imgheights = this.data.imgheightGitss;
        //把每一张图片的对应的高度记录到数组里  
        imgheights[e.target.dataset.id] = imgheight;
        this.setData({
            imgheightGitss: imgheights
        })
    },
    imageMenuLoad: function(e) { //获取图片真实宽度  
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比  
            ratio = imgwidth / imgheight;
        //计算的高度值  
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        var imgheights = this.data.imgheightMenus;
        //把每一张图片的对应的高度记录到数组里  
        imgheights[e.target.dataset.id] = imgheight;
        this.setData({
            imgheightMenus: imgheights
        })
    },
    imageLoadPromtios: function(e) { //获取图片真实宽度  
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比  
            ratio = imgwidth / imgheight;
        //计算的高度值  
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        var imgPromsheights = this.data.imgPromsheights;
        //把每一张图片的对应的高度记录到数组里  
        imgPromsheights[e.target.dataset.id] = imgheight;
        this.setData({
            imgPromsheights: imgPromsheights
        })
    },
    btnClickUrl: function() {
        wx.navigateTo({
            url: '/pages/search/search',
        })
    },
    bindchange: function(e) {
        this.setData({ current: e.detail.current })
    },
    bindMunechange: function(e) {
        this.setData({ currentMune: e.detail.current })
    },
    bindPromschange: function(e) {
        this.setData({ currentProms: e.detail.current })
    },
    bindchangeGith: function(e) {
        this.setData({ currentGits: e.detail.current })
    },
    handleClick: function(e) {
        var userinfo = wx.getStorageSync("userinfo");
        if (!userinfo) {
            var pages = getCurrentPages() //获取加载的页面
            var currentPage = pages[pages.length - 1] //获取当前页面的对象
            var pathUrl = currentPage.route; //当前页面url
            console.log(pathUrl);
            getuserinfo.authorize(pathUrl);
            return;
        }
        wx.showLoading({
            title: '领取中...',
        })
        wx.request({
            url: require('../../config').addCardVoucherUrl,
            method: "POST",
            data: {
                cardId: e.detail.value.cardId,
                openid: app.globalData.userInfo.openid,
                formId: e.detail.formId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                if (res.data.r == "1") {
                    wx.hideToast();
                    wx.showToast({
                        title: '领券成功',
                        icon: 'success',
                        duration: 2000
                    });
                    this.setData({
                        phone: ""
                    })
                } else {
                    wx.hideToast();
                    wx.showToast({
                        title: res.data.msgs,
                        icon: 'none',
                        duration: 2000
                    });
                }
                wx.hideLoading()
            }
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.getData();
        wx.stopPullDownRefresh();
    },
    // 上拉加载更多onReachBottom
    onReachBottom: function() {
        var self = this;
        console.log(self.data.totalcarPageNum + " , " + self.data.currentPage);
        // 当前页是最后一页
        if (self.data.currentPage >= self.data.totalcarPageNum) {
            return;
        }
        // wx.showNavigationBarLoading();
        wx.showToast({
            title: 'loading...',
            icon: 'loading'
        })
        var tempCurrentPage = self.data.currentPage;
        tempCurrentPage = tempCurrentPage + 1;
        self.setData({
            currentPage: tempCurrentPage,
        })

        wx.request({
            url: require('../../config').getmerchant,
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                pn: self.data.currentPage,
                latitude: self.data.latitude,
                longitude: self.data.longitude
            },
            success: resp => {
                var tempArray = self.data.merchants;
                tempArray = tempArray.concat(resp.data.datas);
                this.setData({
                        merchants: tempArray,
                        //totalPageNum: resp.data.pgm.totalPageNum,
                    })
                    //wx.hideNavigationBarLoading();
                wx.hideToast();
            }
        })
    },
    toggleDialog: function() {
        this.setData({ showDialog: !this.data.showDialog })
    },
    btnPhone: function(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        })
    },
    btnSignin: function() {
        wx.navigateTo({
            url: '/pages/points/signin/signin'
        })
    },
    btnMap: function() {
        var latlng = this.data.business.web_latlng_kye.split("#");
        wx.openLocation({
            latitude: parseFloat(latlng[0]),
            longitude: parseFloat(latlng[1]),
            scale: 18
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(e) {
        if (e.target.dataset.type == undefined) {
            var uuid = this.getUUID();
            return {
                title: this.data.business.web_site_title,
                path: '/pages/index/index?openid=' + app.globalData.userInfo.openid + "&uuids=" + uuid
            }
        } else {
            return {
                title: this.data.business.web_site_title,
            }
        }
    },
    getUUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    btnInvitation: function() {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var pathUrl = currentPage.route; //当前页面url
        console.log(pathUrl);
        getuserinfo.authorize(pathUrl);
    },
    // 获取数据  pageIndex：页码参数
    getData: function() {
        //wx.showNavigationBarLoading();
        $Toast({
            content: '加载中',
            type: 'loading',
            duration: 0
        });
        var self = this;
        var userinfo = wx.getStorageSync("userinfo");
        if (userinfo) {
            this.setData({
                hasUserInfo: true
            })
        }
        // wx.request({
        //     url: require('../../config').findTodayCourseNewUrl,
        //     method: "get",
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: res => {
        //         console.log(res);
        //         this.setData({
        //             business: res.data.obj
        //         });
        //     }
        // })

        // wx.request({
        //     url: require('../../config').bannerUrl,
        //     data: {
        //         key: "pointsBanner"
        //     },
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: res => {
        //         this.setData({
        //             githbanners: res.data
        //         })
        //     }
        // })

        // wx.request({
        //     url: require('../../config').findvoucherStatueUrl,
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     success: res => {
        //         if (res.data.msgs == 'Y') {
        //             this.setData({ showDialog: true })
        //         }
        //     }
        // })

        // wx.request({
        //     url: require('../../config').getSearchCardvouchers,
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     method: "GET",
        //     data: {
        //         pn: 1,
        //         pageSize: "6"
        //     },
        //     success: resp => {
        //         if (resp.data.r == "1") {
        //             this.setData({
        //                 cards: resp.data.obj.datas,
        //                 totalPageNum: resp.data.obj.totalRecords
        //             })
        //             if (resp.data.obj.totalRecords > 0) {
        //                 this.setData({ showPage: true })
        //             } else {
        //                 this.setData({ showPage: false })
        //             }
        //         }
        //     }
        // })

        wx.request({
            url: require('../../config').searchCategoryUrl,
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            success: res => {
                let categorys = res.data.data;
                $Toast.hide();
                this.setData({
                    categorys
                })
            }
        })

        // wx.request({
        //     url: require('../../config').getFoodmenuUrl, //仅为示例，并非真实的接口地址
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     method: "GET",
        //     data: {},
        //     success: resp => {
        //         this.setData({
        //             foodmenus: resp.data,
        //         })
        //         wx.hideNavigationBarLoading();
        //         wx.hideToast();
        //     }
        // })

        // wx.request({
        //     url: require('../../config').searchPromotionUrl, //仅为示例，并非真实的接口地址
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     method: "GET",
        //     data: {
        //         pn: 1,
        //         pageSize: "6"
        //     },
        //     success: resp => {
        //         if (resp.data.r == "1") {
        //             this.setData({
        //                 promotions: resp.data.obj.datas,
        //                 promotionNum: resp.data.obj.totalRecords
        //             })
        //             if (resp.data.obj.totalRecords > 0) {
        //                 this.setData({ promotionShow: true })
        //             } else {
        //                 this.setData({ promotionShow: false })
        //             }
        //         }
        //         wx.hideNavigationBarLoading();
        //         $Toast.hide();
        //     }
        // })
    },
    loadNewBaoming: function(data) {
        var i = 0;
        console.log(data);
        var then = this;
        if (data.length > 0) {
            then.setData({
                newbaoming: data[0].name + "报名了" + data[0].courseName
            })
            then.setInter = setInterval(function() {
                i++;
                if (i == data.length) {
                    i = 0;
                }
                then.setData({
                    newbaoming: data[i].name + "报名了" + data[i].courseName
                })
            }, 2000)
        }
    },
    getDataPageOne: function() {
        var self = this;
        wx.request({
            url: require('../../config').getmerchant, //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                pn: 1,
                latitude: self.data.latitude,
                longitude: self.data.longitude
            },
            success: resp => {
                wx.hideNavigationBarLoading();
                this.setData({
                    totalcarPageNum: resp.data.pgm.totalPageNum,
                    merchants: resp.data.datas
                })
                if (resp.data.totalRecords <= 0) {
                    this.setData({ showsPage: true })
                } else {
                    this.setData({ showsPage: false })
                }
            }
        })
    },
})