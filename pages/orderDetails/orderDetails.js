// pages/orderDetails/orderDetails.js
var requestUrl = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oederDetails: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    this.getDetails(options.id)
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
  
  // 获取订单详情
  getDetails: function(id) {
    var self = this
    //
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //
    wx.request({
      url: requestUrl.orders + '/' + id,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        self.setData({
          oederDetails: res.data.data
        })
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },

  // 发起支付
  gotoPay: function(e) {
    var self = this
    var orderId = e.currentTarget.dataset.id
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
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        var data = res.data.data
        // console.log(data)
        self.wxPayment(data)
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },

  // 调起微信支付
  wxPayment: function (data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(res) {
        // console.log(res)
        wx.showToast({
          title: '支付成功',
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'loading'
        })
      },
      complete: function(res) {
        // console.log(res)
      },
    })
  },

  // 评论
  orderCommentTap: function (e) {
    var id = e.currentTarget.dataset.id
    // console.log(id)
    wx.navigateTo({
      url: '../../pages/postComment/postComment?id=' + id
    })
  },
})