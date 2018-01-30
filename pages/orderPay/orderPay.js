// pages/orderPay/orderPay.js
var requestUrl = require('../../config.js');

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stationData: {},
    reserve_id: '',
    carts: [],
    totalNum: 0,
    totalPrice: 0,
    tableNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var stationData = JSON.parse(options.data) || {}
    this.setData({
      stationData: stationData,
      reserve_id: options.reserve_id
    })
    this.getTotalPrice()
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
  
  },

  // 卡座号
  tableNOInput: function(e) {
    var val = e.detail.value
    this.setData({
      tableNo: val
    })
  },
  
  // 统计
  getTotalPrice: function() {
    var self = this
    var carts = wx.getStorageSync('carts') || []
    var total = 0
    var num = 0
    for (let i = 0; i < carts.length; i++) {
      total += carts[i].count * carts[i].price
      num += carts[i].count
    }
    this.setData({
      carts: carts,
      totalNum: num,
      totalPrice: total.toFixed(2)
    })
  },

  // 提交订单
  payOrder: function() {
    var self = this
    var items = []
    var carts = self.data.carts
    for(var i = 0; i < carts.length; i++) {
      items.push({
        id: carts[i].id,
        count: carts[i].count
      })
    }
    var resData = {
      station_id: self.data.stationData.id,
      items: items,
      table_no: self.data.tableNo,
      reserve_id: self.data.reserve_id
    }
    if(!wx.getStorageSync('token')) {
      app.reauthorize(() => {
        self.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      })
      wx.showToast({
        title: '您未登录',
        icon: 'loading',
        mask: true,
      })
      return
    }
    if (!self.data.tableNo) {
      wx.showToast({
        title: '请输入卡座号',
        icon: 'loading',
        mask: true,
      })
      return
    }
    wx.showLoading({
      title: '提交订单...',
      mask: true
    })
    wx.request({
      url: requestUrl.orders,
      data: resData,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        self.goPayment(res.data.data)
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },

  // 发起支付
  goPayment: function(orderId) {
    var self = this
    wx.showLoading({
      title: '发起支付',
      mask: true
    })
    wx.request({
      url: requestUrl.signature,
      data: {
        order_id: orderId
      },
      header: {
        token: wx.getStorageSync('token'),
        device: 'minpg'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        var data = res.data.data
        self.wxPayment(data, orderId)
      },
      fail: function(res) {
        wx.showToast({
          title: '发起支付失败',
        })
      },
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },
  
  // 调起微信支付
  wxPayment: function (data, orderId) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res) {
        // console.log(res)
        wx.showToast({
          title: '支付成功',
        })
        // 跳转到订单详情页面
        wx.redirectTo({
          url: '../orderDetails/orderDetails?id=' + orderId
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'loading'
        })
      },
      complete: function (res) {
        // console.log(res)
      },
    })
  }
})