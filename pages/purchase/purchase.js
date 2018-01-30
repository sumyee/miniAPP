// pages/purchase/purchase.js
var requestUrl = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
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
    this.getData()
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

  // 
  getData: function() {
    var self = this

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    //
    wx.request({
      url: requestUrl.reserve_stations,
      data: self.data.paging,
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        //  console.log(res)
        var data = self.data.data.concat(res.data.data)
        self.setData({
          data: data,
          isHideLoadMore: true
        })
        // 
        if (!res.data.data.length && data.length) {
          self.setData({
            loadedAll: true
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },

  // 上拉加载更多
  onReachBottom: function () {
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
    self.getData()
  },

  // purchaseTap
  purchaseTap: function(e) {
    var self = this
    var station = e.currentTarget.dataset.station
    var reserve_id = e.currentTarget.dataset.reserveid
    var status = e.currentTarget.dataset.status
    if (status == 'SUCCESS' || status == 'PENDING') {
      wx.navigateTo({
        url: '../menu/menu?data=' + JSON.stringify(station) + '&tab=0&reserve_id=' + reserve_id
      })
    }
  }
})