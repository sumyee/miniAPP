// pages/order/order.js
var requestUrl = require('../../config.js');

Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    currentTab: 'ALL',
    status: 'ALL',
    orders: [],
    isHideLoadMore: true,
    loadedAll: false,
    paging: {
      page: 1,
      page_size: 10
    }
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    var self = this;

    // 
    self.getOrders()
  },

  swichNav: function (e) {

    var self = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      self.setData({
        currentTab: e.target.dataset.current,
        status: e.target.dataset.current
      })
    }
    // console.log(e.target.dataset.current)
    // 
    self.setData({
      orders: [],
      isHideLoadMore: true,
      loadedAll: false,
      paging: {
        page: 1,
        page_size: 10
      }
    })
    self.getOrders()
  },

  // 获取订单列表
  getOrders: function () {
    var self = this

    //
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 
    var requestData = self.data.paging
    requestData['status'] = self.data.status === 'ALL' ? '' : self.data.status
    //
    wx.request({
      url: requestUrl.orders,
      data: requestData,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        var data = self.data.orders.concat(res.data.data)
        self.setData({
          orders: data,
          isHideLoadMore: true
        })
        // 
        if (!res.data.data.length && data.length) {
          self.setData({
            loadedAll: true
          })
        }
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })

  },

  // scrolltolower
  scrolltolower: function (e) {
    var self = this
    if (!self.data.isHideLoadMore) return
    var orderType = e.currentTarget.dataset.type
    self.setData({
      isHideLoadMore: false
    })
    // console.log(orderType)
  },

  // 加载更多
  onReachBottom: function (e) {
    var self = this
    var paging = self.data.paging
    if (!self.data.isHideLoadMore) return
    if (self.data.loadedAll) return
    // console.log('加载更多')
    self.setData({
      isHideLoadMore: false,
      paging: {
        page: paging.page + 1,
        page_size: 10
      }
    })
    self.getOrders()
  },

  // 查看订单详情
  orderTap: function (e) {
    // console.log(e)
    var self = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../orderDetails/orderDetails?id=' + id,
    })
  },

  // 付款
  orderPayTap: function (e) {
    var self = this
    var orderId = e.currentTarget.dataset.id
    // console.log(orderId)
    // 
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
      success: function (res) {
        // console.log(res)
        var data = res.data.data
        self.wxPayment(data)
      },
      fail: function (res) {
        wx.showToast({
          title: '发起支付失败',
        })
      },
      complete: function (res) {
        wx.hideLoading()
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

  // 调起微信支付
  wxPayment: function (data) {
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