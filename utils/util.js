const app = getApp();

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const currentTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-')
}

const getQianyitTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate() - 1
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-')
}

const futureTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate() + 7
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function orderPay(orderNum, caballk) {
    console.log(orderNum);
    wx.showLoading({
        title: '发起支付...',
    })
    wx.requestPayment({
        'timeStamp': orderNum.timeStamp,
        'nonceStr': orderNum.nonceStr,
        'package': orderNum.package,
        'signType': 'MD5',
        'paySign': orderNum.paySign,
        'success': function(res) {
            console.log("微信成功支付", res)
            wx.hideLoading();
            wx.switchTab({ url: '/pages/order/view/order-list' });
            caballk && caballk;
        },
        'fail': function(res) {
            wx.hideLoading();
        }
    })
}

function countdown(that) {
    var EndTime = that.data.end_time || [];
    var NowTime = new Date().getTime();
    var total_micro_second = EndTime - NowTime || []; //单位毫秒
    if (total_micro_second < 0) {
        total_micro_second = 1; //单位毫秒 ------  WHY？
    }
    // 渲染倒计时时钟
    that.setData({
        clock: dateformat(total_micro_second) //若已结束，此处输出‘0天0小时0分钟0秒‘
    });
    if (total_micro_second <= 0) {
        that.setData({
            clock: "已经截止"
        });
        return;
    }
    setTimeout(function() {
        total_micro_second -= 1000;
        countdown(that);
    }, 1000)
}

// 时间格式化输出，如11天03小时25分钟19秒  每1s都会调用一次
function dateformat(micro_second) {
    // 总秒数
    var second = Math.floor(micro_second / 1000);
    // 天数
    var day = Math.floor(second / 3600 / 24);
    // 小时
    var hr = Math.floor(second / 3600 % 24);
    // 分钟
    var min = Math.floor(second / 60 % 60);
    // 秒
    var sec = Math.floor(second % 60);
    return day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
}

module.exports = {
    formatTime: formatTime,
    currentTime: currentTime,
    futureTime: futureTime,
    getQianyitTime: getQianyitTime,
    countdown: countdown,
    orderPay: orderPay
}