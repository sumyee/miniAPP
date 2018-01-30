//app.js
const config = require('./config.js')

App({
  globalData: {
    userInfo: null,
    currentCity: '定位中..',
    currentCityId: '',
    cityData: {}
  },
  onLaunch: function () {
    var self = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []

    //
    wx.checkSession({
      success: function (res) {
        self.wxLogin()
      },
      fail: function (res) {
        wx.setStorageSync('token', '')
        self.wxLogin()
      },
      complete: function (res) {
        // console.log(res)
      },
    })


  },

  onShow: function() {

  },

  // 微信登录
  wxLogin: function (cb) {
    var self = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
        if (res.code) {
          self.getUserInfo(res.code, cb)
        }
      }
    })
  },

  // 获取用户信息
  getUserInfo: function (code, cb) {
    var self = this
    // 
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo

        // console.log('getUserInfo', res)

        self.login(code, cb)
      },
      fail: res => {
        // console.log(res)
        wx.showModal({
          title: '用户未授权',
          content: '如需正常使用功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
          showCancel: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) {
            // console.log(res)
            // self.reauthorize()
            if (res.confirm) {
              self.reauthorize()
            }
          },
        })
      }
    })
  },

  // 重新授权
  reauthorize: function(cb) {
    var self = this
    wx.openSetting({
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {
        // console.log('重新授权', res)
        if (res.authSetting['scope.userInfo']){
          self.wxLogin(cb)
        }
      },
    })
  },

  // 向服务器发送登录请求
  login: function (code, cb) {
    var self = this
    // console.log(this.globalData.userInfo)
    if (!this.globalData.userInfo) return
    var uData = this.globalData.userInfo
    // 
    var postData = {
      code: code,
      nick_name: uData.nickName,
      avatar: uData.avatarUrl,
      gender: uData.gender,
      province: uData.province,
      city: uData.city
    }
    wx.request({
      url: config.loginUrl,
      data: postData,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        wx.setStorageSync('token', res.data.data.token)
        wx.setStorageSync('userid', res.data.data.userid)
        wx.showToast({
          title: '登录成功', 
        })
        cb && cb()
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // preview
  previewImage: function (current, urls) {
    // console.log(urls)
    wx.previewImage({
      current: current,
      urls: urls,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})