// pages/teacherLogin/teacherLogin.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        business: null,
        banners: [],
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
        teachersColumnList: [],
        contentList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        let userId = getApp().globalData.userInfo.id; //用户id
        //let userId = "4"; //用户id
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
            }),

            wx.request({
                url: require('../../config').teachersColumn,
                method: "post",
                data: {
                    userId: userId
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: res => {
                    this.setData({
                            teachersColumnList: res.data.data,

                        })
                        // console.log("教师专栏", res)
                }
            })
    },

    //教师专栏详情
    columnDetails(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/columnDetails/columnDetails?id=' + id
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