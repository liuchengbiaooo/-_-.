const app = getApp();
var getuserinfo = require('../../../utils/getuserinfo.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        toView: '',
        totalPageNum: 0, // 总页数
        currentPage: 1, // 当前页数  默认是1
        height: 0,
        cards: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var pages = getCurrentPages() //获取加载的页面
        var currentPage = pages[pages.length - 1] //获取当前页面的对象
        var merchantId = options.merchant;
        var urlsq = currentPage.route; //当前页面url
        getuserinfo.authorize(urlsq);

        //this.getCards();
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
        //this.getCards();
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
        //this.getCards();
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
            return;
        }
        wx.showNavigationBarLoading();
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
            url: require('../../../config').personMycardvoucherUrl,
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                pn: self.data.currentPage,
                openid: app.globalData.userInfo.openid
            },
            success: resp => {
                var tempArray = self.data.cards;
                tempArray = tempArray.concat(resp.data.obj.datas);
                this.setData({
                    cards: tempArray,
                    totalPageNum: resp.data.obj.pgm.totalPageNum,
                })
                wx.hideNavigationBarLoading();
                wx.hideToast();
            }
        })
    },
    btnShiYong: function() {
        wx.navigateTo({
            url: '/pages/foodmenu/foodmenu',
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    getCards: function() {
        wx.showNavigationBarLoading();
        wx.request({
            url: require('../../../config').personMycardvoucherUrl,
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                pn: 1,
                openid: app.globalData.userInfo.openid
            },
            success: resp => {
                wx.hideNavigationBarLoading();
                console.log(resp);
                if (resp.data.r == "1") {
                    this.setData({
                        cards: resp.data.obj.datas,
                        totalPageNum: resp.data.obj.pgm.totalPageNum,
                        currentPage: 1
                    })
                    if (resp.data.obj.totalRecords <= 0) {
                        this.setData({ showPage: true })
                    } else {
                        this.setData({ showPage: false })
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
    }
})