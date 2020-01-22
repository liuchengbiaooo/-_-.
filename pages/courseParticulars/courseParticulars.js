// pages/courseParticulars/courseParticulars.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        key: "",
        curriculum: {},
        txt: "“探究式”主题课程的特点：整合性：不是以单一学科为学习的目标, 而是以幼儿的情感、态度、能力的培养和直接经验的获得为宗旨。课程内容来源于幼儿的生活, 涉及自然科学、社会、文化、艺术等各个领域, 实现各领域内容的高度整合。不是单一化的教学模式, 而是引导幼儿采用多样化的活动方式, 多样化的表现方式, 多样化的组织形式, 实现课程的整合"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //console.log("options", options)
        let key = options.key;
        wx.request({
            url: require('../../config').interestStudiesID, //仅为示例，并非真实的接口地址
            method: "get",
            data: {
                id: key
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                //console.log("gafasdfasd", res)
                let result = res.data.data;
                this.setData({
                    curriculum: result
                })
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