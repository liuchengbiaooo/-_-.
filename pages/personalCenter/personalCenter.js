let self;
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
        type: 0, //全部课程type=0 ;待学课程 type=1 ;待评价课程 type=2;
        courseList: {},
        name: 'll',
        numberbiao: '',
        tiem: '',
        isshow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    //把时间戳转化时间
    changeTime(time) {
        // let times = moment(time).format();
        let d = new Date(time);
        let batchDate = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
        return batchDate

    },
    onLoad: function(options) {
        self = this;
        console.log(" getApp().globalData", getApp().globalData.userInfo.nickName)
        self.setData({
            name: getApp().globalData.userInfo.nickName
        })
        let userId = getApp().globalData.userInfo.id; //用户id

        //let userId = "7"; //用户id
        wx.request({
            url: require('../../config').myCourses,
            method: "post",
            data: {
                userId: userId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                if (res.data.code !== 500) {
                    let result = res.data.data.course;
                    let tiem = this.changeTime(result.createTime)
                    this.setData({
                        tiem,
                        courseList: result,
                        isshow: true
                    })
                }

            }
        })

        wx.request({
            url: require('../../config').teacherData,
            method: "post",
            data: {
                userId: userId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                console.log(res)
                    // if (res.data.code !== 500) {
                    //   let result = res.data.data.course;
                    //   let tiem = this.changeTime(result.createTime)
                    //   this.setData({
                    //     tiem,
                    //     courseList: result,
                    //     isshow: true
                    //   })
                    // }

            }
        })
    },
    // 点击tabs
    handleChange: function(e) {
        console.log(e)
        let current = e.detail.key
        this.setData({
            current
        })
    },
    gostudent() {
        wx.navigateTo({
            url: '/pages/studentList/studentList'
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