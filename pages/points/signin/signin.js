// pages/points/signin/signin.js
const app = getApp();
var utils = require('../../../utils/util.js');
var calendarSignData;
var date;
var calendarSignDay;
var is_qd;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qdView: false,
    calendarSignData: "",
    calendarSignDay: "",
    currentDate:null,
    rule:0,
    is_qd: false,
    points:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDatas();
    
  },
  quxiaoQd: function (e) {
    var that = this;
    that.setData({
      qdView: false,
      is_qd: true
    })
  },

  //事件处理函数
  calendarSign: function (e) {
    var continuity = wx.getStorageSync("continuity");
    var today = 0;
    if (continuity != null) {
      if (utils.currentTime(new Date()) == continuity.date) {
        this.setData({
          is_qd: true,
          qdView: true
        })
        return;
      }
      if (utils.getQianyitTime(new Date()) == continuity.date) {
        this.setData({
          rule: continuity.day + 1
        })
        today = continuity.day;
        continuity.day = continuity.day + 1;
        continuity.date = utils.currentTime(new Date());
        
      } else {
        continuity = {date: utils.currentTime(new Date()), day: 1}
      }
    }
    //wx.setStorageSync("continuity", { date: "2018-12-12", day: 1 });
    wx.setStorageSync("continuity", continuity);
    var that = this;
    that.setData({
      qdView: true
    })
    //console.log(date);
    //console.log("calendarSignData = " + calendarSignData.length);
    calendarSignData[parseInt(date)] = parseInt(date)
    calendarSignDay = calendarSignDay + 1;
    var points = 5;
    console.log("today = " + today);
    if (today+1 >= 7) {
      points += 10;
    }
    wx.request({
      url: require('../../../config').pointsSigninUrl,
      method: "POST",
      data: {
        "openid": app.globalData.userInfo.openid,
        "points": points
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //通过post传值，所以要加header
      },
      success: function (res) {
        console.log(res);
        that.setData({
          rule: continuity.day,
          integral: points,
        })
      }
    })

    wx.setStorageSync("calendarSignData", calendarSignData);
    wx.setStorageSync("calendarSignDay", calendarSignDay);
    

    this.setData({
      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadDatas();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync("calendarSignData")
    wx.removeStorageSync("calendarSignDay")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadDatas();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadDatas : function() {
    var that = this;
    var mydate = new Date();
    this.setData({
      currentDate: utils.currentTime(mydate)
    })
    var year = mydate.getFullYear();
    var month = mydate.getMonth() + 1;
    date = mydate.getDate();
    var day = mydate.getDay();
    var nbsp = 7 - ((date - day) % 7);
    var monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    calendarSignData = new Array(monthDaySize)
    //console.log("calendarSignData = " + calendarSignData.length)
    // 传ajax
    wx.request({
      url: require('../../../config').pointsdateUrl,
      method: "POST",
      data: {
        "openid": app.globalData.userInfo.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        // 判断是否签到过   
        if (res.data == null) {
          wx.setStorageSync("calendarSignData", calendarSignData);
        } else {
          var is_qd = false;
          for (var i in res.data.obj) {
            parseInt(res.data.obj[i])
            calendarSignData[parseInt(res.data.obj[i])] = parseInt(res.data.obj[i])
            wx.setStorageSync("calendarSignData", calendarSignData);
            if (parseInt(res.data.obj[i]) == date) {
              wx.setStorageSync("calendarSignDay", 1);
              is_qd = true
            } else {
              wx.setStorageSync("calendarSignDay", 0);
            }
          }
        }
        //calendarSignData = wx.getStorageSync("calendarSignData")
        calendarSignDay = wx.getStorageSync("calendarSignDay")
        //console.log("calendarSignData = " + calendarSignData.length)

        that.setData({
          is_qd: is_qd,
          year: year,
          month: month,
          nbsp: nbsp,
          monthDaySize: monthDaySize,
          date: date,
          calendarSignData: calendarSignData,
          calendarSignDay: calendarSignDay,
          points: res.data.msgs
        })
      }
    })

    var continuity = wx.getStorageSync("continuity");
    if (continuity != null) {
      if (utils.currentTime(new Date()) == continuity.date) {
        this.setData({
          rule: continuity.day
        })
        return;
      }
      if (utils.getQianyitTime(new Date()) == continuity.date) {
        this.setData({
          rule: continuity.day
        })
      } else {
        this.setData({
          rule: 0
        })
        wx.removeStorageSync("continuity");
      }
    }
  }
})