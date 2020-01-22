// 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
function authorize(currentPages){
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.userInfo']) {
        wx.redirectTo({ url: '/pages/authorize/authorize?currentPages=' + currentPages})
      }
    }
  })
}
module.exports = {
  authorize: authorize,
}