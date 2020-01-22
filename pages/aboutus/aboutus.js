// pages/aboutus/aboutus.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        business: null,
        banners: null,

        //是否采用衔接滑动  
        circular: true,
        //是否显示画板指示点  
        indicatorDots: true,
        indicatorss: false,
        //选中点的颜色  
        indicatorcolor: "#000",
        //是否竖直  
        vertical: false,
        //是否自动切换  
        autoplay: true,
        autoplayss: false,
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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // wx.request({
        //   url: require('../../config').findbusinessUrl, //仅为示例，并非真实的接口地址
        //   method: "get",
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   success: res => {
        //     console.log(res);
        //     this.setData({
        //       business: res.data,
        //       banners: res.data.web_banner_key.split("#")
        //     });
        //   }
        // })
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
        wx.stopPullDownRefresh();
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