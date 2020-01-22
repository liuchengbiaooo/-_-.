// pages/meals/meals.js
var WxParse = require('../../wxParse/wxParse.js');
var getuserinfo = require('../../utils/getuserinfo.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //是否采用衔接滑动  
        circular: true,
        //是否显示画板指示点  
        indicatorDots: true,
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
        //图片宽度 
        imgwidth: 750,
        //默认  
        current: 0,
        cartType: '10',
        prodId: 0,
        product: null,
        cart: null,

        current1: 'tab1',
        comments: null,
        totalPageNum: 0, // 总页数
        currentPage: 1, // 当前页数  默认是1
        showPage: false,
        business: null,
        aggregate: '',
        how: '',
        actions2: [{
            name: '选好了',
            color: '#ed3f14'
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("options", options)
        var prodId = options.prodId;
        this.setData({
            prodId: prodId,
        })
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var urlsq = currentPage.route + "&prodId=" + prodId; //当前页面url
        getuserinfo.authorize(urlsq);

        this.loadData();
        this.loadCartList();
    },
    bindchange: function(e) {
        // console.log(e.detail.current)
        this.setData({ current: e.detail.current })
    },
    imageLoad: function(e) { //获取图片真实宽度  
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比  
            ratio = imgwidth / imgheight;
        console.log(imgwidth, imgheight)
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
    btnMiaoding: function(e) {
        this.setData({ cartType: e.target.dataset.carttype });
        this.loadData();
    },
    //立即报名
    btnAddCart: function(e) {
        var dataname = e.currentTarget.dataset.name;
        var cataIndex = e.currentTarget.dataset.calindex; //课程id
        var prodIndex = e.currentTarget.dataset.index;
        let userId = getApp().globalData.userInfo.id; //用户id
        wx.showLoading({
            title: '处理中...',
        })
        console.log('e.currentTarget.dataset', e.currentTarget.dataset, getApp().globalData.userInfo)
        wx.request({
            url: require('../../config').shoppingTrolley,
            method: "post",
            data: {
                userId: userId,
                courseId: cataIndex,
                type: 0
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                console.log("返回", res)

                this.loadCartList();
                wx.hideLoading();
            }
        })
    },
    //点击增加或者减少
    btnChange: function(e) {
        var courseId = e.currentTarget.dataset.id;
        var types = e.currentTarget.dataset.type;
        var userId = e.currentTarget.dataset.userid;
        //var cataIndex = 0;
        // var prodIndex = 0;

        if (types == 'minus') {
            var type = 1
        } else if (types == 'add') {
            var type = 0;
        }
        wx.showLoading({
            title: '处理中...',
        })
        wx.request({
            url: require('../../config').shoppingTrolley,
            method: "post",
            data: {
                userId: userId,
                courseId: courseId,
                type: type
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                console.log("sgag", res)
                this.loadCartList();
                wx.hideLoading();
            }
        })
    },

    //####################################
    handleChange({ detail }) {
        this.setData({
            current1: detail.key
        });
    },

    btnPhone: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.business.web_phone
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
    btnAnquanda: function() {
        var imgs = this.data.business.web_business.split("#");
        wx.previewImage({
            current: imgs[0], // 当前显示图片的http链接
            urls: imgs // 需要预览的图片http链接列表
        })
    },
    btnViewImage: function(e) {
        var index = e.currentTarget.dataset.comindex;
        var imageUrl = e.currentTarget.dataset.image;
        wx.previewImage({
            current: imageUrl, // 当前显示图片的http链接
            urls: this.data.comments[index].images // 需要预览的图片http链接列表
        })
    },
    //###############################


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //this.loadData();
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
        this.loadData();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var self = this;
        console.log(self.data.totalPageNum + " , " + self.data.currentPage);
        // 当前页是最后一页
        if (self.data.currentPage >= self.data.totalPageNum) {
            console.log("最后一页了");
            return;
        }
        wx.showToast({
            title: 'loading...',
            icon: 'loading'
        })
        var tempCurrentPage = self.data.currentPage;
        tempCurrentPage = tempCurrentPage + 1;
        self.setData({
            currentPage: tempCurrentPage
        })

        wx.showNavigationBarLoading();
        wx.request({
            url: require('../../config').searchMercantComUrl, //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                pn: self.data.currentPage,
                prodNum: this.data.product.prodNum
            },
            success: resp => {
                wx.hideNavigationBarLoading();
                var tempArray = self.data.comments;
                tempArray = tempArray.concat(resp.data.datas);
                self.setData({
                    comments: tempArray
                })
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    loadData: function() {
        var that = this;
        //wx.showNavigationBarLoading();
        // wx.request({
        //     url: require('../../config').getProductUrl + "/" + this.data.prodId, //仅为示例，并非真实的接口地址
        //     header: {
        //         'content-type': 'application/json' // 默认值
        //     },
        //     method: "GET",
        //     data: {
        //         cartType: this.data.cartType,
        //         openid: app.globalData.userInfo.openid
        //     },
        //     success: resp => {
        //         this.setData({
        //             product: resp.data,
        //         })
        //         WxParse.wxParse('content', 'html', resp.data.content, that, 5);
        //         wx.setNavigationBarTitle({
        //             title: resp.data.name //页面标题为路由参数
        //         })
        //         wx.hideNavigationBarLoading();
        //         wx.hideToast();
        //         this.getProductComment();
        //     }
        // })

        wx.request({
            url: require('../../config').courseDetails,
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                id: this.data.prodId,
            },
            success: res => {
                console.log("res", res)
                let particulars = res.data.data
                this.setData({
                    product: particulars,
                    business: '90'
                })
                wx.setNavigationBarTitle({
                    title: particulars.name //页面标题为路由参数
                })
                let grade = '适用年级：' + particulars.grade;
                let startTime = '开始时间：' + particulars.startTime;
                let courseTime = '上课时间：' + particulars.courseTime;
                let courseAddress = '上课地点：' + particulars.courseAddress;
                let coach = '辅导教师：' + particulars.coach;
                let summary = '课程简介：' + particulars.summary;
                WxParse.wxParse('content', 'html', grade, that, 5);
                WxParse.wxParse('content1', 'html', startTime, that, 5);
                WxParse.wxParse('content2', 'html', courseTime, that, 5);
                WxParse.wxParse('content3', 'html', courseAddress, that, 5);
                WxParse.wxParse('content4', 'html', coach, that, 5);
                WxParse.wxParse('content5', 'html', summary, that, 5);

                // wx.setNavigationBarTitle({
                //     title: resp.data.name //页面标题为路由参数
                // })
                // wx.hideNavigationBarLoading();
                // wx.hideToast();
                // this.getProductComment();
            }
        })


        if (this.data.cartType != '') {
            //this.loadCartList();
        }
    },
    getProductComment: function() {

        wx.request({
            url: require('../../config').searchMercantComUrl, //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                pn: 1,
                prodNum: this.data.product.prodNumber
            },
            success: resp => {
                console.log(resp);
                this.setData({
                    totalPageNum: resp.data.pgm.totalPageNum,
                    comments: resp.data.datas
                })
                if (resp.data.totalRecords <= 0) {
                    this.setData({ showPage: true })
                } else {
                    this.setData({ showPage: false })
                }
            }
        })
        wx.request({
            url: require('../../config').zhongheUrl, //仅为示例，并非真实的接口地址
            method: "get",
            data: {
                prodNum: this.data.product.prodNumber
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: res => {
                this.setData({
                    business: res.data.obj
                });
            }
        })
    },
    //查询购物车信息
    loadCartList: function() {
        let userId = getApp().globalData.userInfo.id; //用户id
        wx.request({
            url: require('../../config').cartListUrl,
            method: "post",
            data: {
                userId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {

                let cart = res.data.data;
                var how = 0; //购物车总数量
                var aggregate = 0; //购物车金额
                for (var i = 0; i < cart.length; i++) {
                    console.log("购物车", parseFloat(cart[i].price))
                    aggregate += parseFloat(cart[i].price) * parseFloat(cart[i].num);
                    how += parseFloat(cart[i].num);
                    cart[i].total = parseFloat(cart[i].price) * parseFloat(cart[i].num);
                }
                console.log("购物车", res.data.data, how, aggregate)
                this.setData({
                    cart,
                    how,
                    aggregate
                });
                //$Toast.hide();
            }
        })
    },
    handleCancel2() {
        this.setData({
            visible2: false
        });
    },
    btnCheckout: function() {
        if (this.data.cart <= 0) {
            wx.showModal({
                title: "提示",
                content: "您还没有选择课程~",
                showCancel: false,
                confirmText: "确定"
            })
            return;
        }
        wx.navigateTo({
            url: '/pages/order/checkout/checkout'
        })
    },
    handleOpen2: function() {
        if (this.data.cart.totalItems <= 0) {
            wx.showModal({
                title: "提示",
                content: "您的购物车空空如也~",
                showCancel: false,
                confirmText: "确定"
            })
            return;
        }
        this.setData({
            visible2: true
        });
    }
})