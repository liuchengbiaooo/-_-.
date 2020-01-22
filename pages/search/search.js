// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword: "",
        datas: null,
        isSelectd: true,
        totalPageNum: 0, // 总页数
        currentPage: 1, // 当前页数  默认是1
        showPage: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    handleFruitChange(e) {
        this.setData({
            current: e.detail.value
        });
    },
    keywordInput: function(e) {
        this.setData({
            keyword: e.detail.value
        })
    },
    btnSearchKey: function(e) {
        if (this.data.keyword == null || this.data.keyword == "") {
            return;
        }
        this.setData({
            isSelectd: false
        });
        this.searchData(this.data.keyword);
    },
    //失去焦点
    resignFocus: function(e) {
        var keyword = e.detail.value;
        if (keyword == null || keyword == "") {
            return;
        }
        this.setData({
            isSelectd: false
        });
        this.searchData(keyword);
    },
    searchData: function(keyword) {

        wx.showNavigationBarLoading();
        wx.request({
            url: require('../../config').viewmerchantList, //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                name: keyword
            },
            success: res => {
                let result = res.data.data;

                console.log("Res", res)
                if (res.data.count == 0) {
                    this.setData({
                        datas: result,
                        //totalPageNum: resp.data.obj.pgm.totalPageNum,
                        //currentPage: 1
                    })
                    if (result.length == 0) {
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
                wx.hideNavigationBarLoading();
            }
        })
    },
    //获取焦点
    activeFocus: function(event) {
        this.setData({
            isSelectd: true
        });
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
            url: require('../../config').searchpProduct, //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            data: {
                pn: self.data.currentPage,
                keyword: self.data.keyword
            },
            success: resp => {
                var tempArray = self.data.datas;
                tempArray = tempArray.concat(resp.data.obj.datas);
                this.setData({
                    datas: tempArray,
                    totalPageNum: resp.data.obj.pgm.totalPageNum,
                })
                wx.hideNavigationBarLoading();
                wx.hideToast();
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})