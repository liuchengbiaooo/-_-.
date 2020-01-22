var WxParse = require('../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        curriculum: {},
        imgURL: '',
        topData: [],
        bottomData: [],
        imgWidth: '',
        imgHeight: '',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        let id = "4539";
        wx.request({
            url: require('../../config').teachersColumnDetails,
            method: "post",
            data: {
                id: id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                // let info = res.data.data.info;
                // let topData = [];
                // let bottomData = [];
                // let matchReg = /(?<=<p>).*?(?=<\/p>)/g;
                // let imgSRC = /http:[\'\"]?([^\'\"]*)[.jpg|.png|.bmp|.tif|.gif]?/gi; //拿到src
                // let data = info.match(matchReg);
                // for (var i = 0; i < data.length; i++) {
                //     if (data[i].match(imgSRC)) {
                //         let imgURL = data[i].match(imgSRC)
                //         this.setData({
                //             imgURL
                //         })
                //     } else {
                //         if (i < data.length - (data.length - 2)) {
                //             topData.push(data[i])
                //         } else {
                //             bottomData.push(data[i])
                //         }
                //     }
                // }
                WxParse.wxParse('content', 'html', res.data.data.info, that, 5);
                wx.setNavigationBarTitle({
                        title: res.data.data.title
                    })
                    // console.log("topData", topData)
                    // this.setData({
                    //     curriculum: res.data.data,
                    //     topData,
                    //     bottomData
                    // })
            }
        })
    },

    //图片高度
    imageLoad: function(e) {
        console.log(e)
        let imgWidth = e.detail.width;
        let imgHeight = e.detail.height;
        this.setData({
            imgWidth,
            imgHeight
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