//index.js
const logsRoute = require('../../router').logsRoute

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: app.globalData.userInfo || {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: logsRoute
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  // goOrderpage
  goOrderpage: function () {
    var self = this
    if(!wx.getStorageSync('token')) {
      app.reauthorize(() => {
        self.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      })
      wx.showToast({
        title: '您还没登录',
        icon: 'loading'
      })
      return
    }
    wx.navigateTo({
      url: '../order/order'
    })
  },

  // goPurchasePage
  goPurchasePage: function () {
    var self = this
    if (!wx.getStorageSync('token')) {
      app.reauthorize(() => {
        self.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      })
      wx.showToast({
        title: '您还没登录',
        icon: 'loading'
      })
      return
    }
    wx.navigateTo({
      url: '../purchase/purchase'
    })
  }
})
