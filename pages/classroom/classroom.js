// pages/classroom/classroom.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classroomList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let userId = getApp().globalData.userInfo.id; //用户id
        //let userId = "7";
        wx.request({
            url: require('../../config').classrooms,
            method: "post",
            data: {
                userId: userId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                this.setData({
                    classroomList: res.data.data
                })
            }
        })
    },
    //查看
    details(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/teacherCourseDetails/teacherCourseDetails?id=' + id
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