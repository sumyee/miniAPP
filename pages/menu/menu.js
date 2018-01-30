// pages/menu/menu.js
var requestUrl = require('../../config.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    stationData: {},
    reserve_id: '',
    carts: [],
    totalPrice: 0,
    totalNum: 0,
    tab: 1,
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 500, //可以控制动画
    list: '',
    proData: [],
    schedule: [],
    openPopup: false
  },
  change(e) {
    this.setData({
      indexSize: e.detail.current
    })
  },
  scrollTo(e) {
    this.setData({
      indexSize: e.target.dataset.index
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 清空购物车
    wx.setStorageSync('carts', [])
    // console.log(options)
    // 
    var reserve_id = options.reserve_id || ''
    var tab = options.tab || ''
    var stationData = JSON.parse(options.data)
    if(tab && tab === '0') {
      this.setData({
        tab: 0
      })
    }
    if (reserve_id) {
      this.getReserveData(reserve_id)
    }
    this.setData({
      stationData: stationData,
      reserve_id: reserve_id
    })
    // 
    this.getProData(stationData.id)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('onShow')
    // this.getTotalPrice()
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

  // 获取酒水
  getProData: function (id) {
    // 
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 
    var self = this
    wx.request({
      url: requestUrl.products + '/' + id,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        self.setData({
          proData: res.data.data
        })
        // 
        wx.hideLoading()
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 商品数量变化
  onChangeNumber: function (e) {
    var self = this
    var carts = self.data.carts
    // console.log(e)
    var proData = e.currentTarget.dataset.data
    var changeType = e.detail.type
    var count = e.detail.number

    if(carts.length) {
      var same = false
      var index = -1
      for(let i = 0; i < carts.length; i++) {
        if(carts[i].id === proData.id) {
          same = true
          index = i
        }
      }
      // 是否存在商品
      if(same) {
        if(count) {
          carts[index].count = count
        } else {
          carts.splice(index, 1)
        }
      } else {
        proData['count'] = count
        carts.unshift(proData)
      }
    } else {
      proData['count'] = count
      carts.unshift(proData)
    }

    // 本地缓存购物车信息
    wx.setStorageSync('carts', carts)
    self.setData({
      carts: carts,
      popupCarts: wx.getStorageSync('carts')
    })
    // console.log(self.data.carts)
    // 购物车无商品 收起弹出层
    if (!wx.getStorageSync('carts').length) {
      self.setData({
        openPopup: false
      })
    }
    //
    self.getTotalPrice()
  },

  // 统计数量价格
  getTotalPrice() {
    var self = this
    var carts = this.data.carts
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
    // console.log(self.data)
  },

  // 清空购物车数据
  clearCartAll: function(e) {
    var self = this
    wx.setStorageSync('carts', [])
    self.setData({
      carts: [],
      openPopup: false
    })
    //
    self.getTotalPrice()
  },

  // 订台进度
  getReserveData: function (reserve_id) {
    var self = this
    wx.request({
      url: requestUrl.reserve + '/' + reserve_id,
      header: {
        token: wx.getStorageSync('token') || ''
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        self.setData({
          schedule: res.data.data || []
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 查看详情
  showProDetails: function (e) {
    var data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: '../productDetails/productDetails?data=' + JSON.stringify(data) 
    })
  },

  // 去结算
  gotoPay: function() {
    var self = this
    if (!wx.getStorageSync('carts').length) return
    self.setData({
      openPopup: false
    })
    wx.navigateTo({
      url: '../orderPay/orderPay?reserve_id=' + self.data.reserve_id +'&data=' + JSON.stringify(self.data.stationData)
    })
  },

  // 取消订台
  cancelBook: function () {
    var self = this
    var id = self.data.reserve_id
    if (!id) return
    // 
    wx.showLoading({
      title: '取消中...',
      mask: true
    })
    // 
    wx.request({
      url: requestUrl.cancelReserve + '/' + id,
      header: {
        token: wx.getStorageSync('token'),
        userid: wx.getStorageSync('userid') || ''
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.data === 'SUCCESS'){
          wx.showToast({
            title: '取消成功',
            icon: 'succese'
          })
          self.setData({
            schedule: []
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },

  // showpopup
  showPopup: function () {
    var self = this
    if(!wx.getStorageSync('carts').length) return
    self.setData({
      openPopup: true,
      popupCarts: wx.getStorageSync('carts')
    })
  },

  //
  changeTabOne: function (e) {
    this.setData({
      tab: 0
    })
  },
  //
  changeTabTwo: function (e) {
    this.setData({
      tab: 1
    })
  }
})