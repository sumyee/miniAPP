// pages/searchResult/searchResult.js
var requestUrl = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '',
    stations: [],
    isHideLoadMore: true,
    loadedAll: false,
    paging: {
      page: 1,
      page_size: 10
    },
    reqPaging: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      searchKey: options.searchKey
    })
    // 设置标题
    wx.setNavigationBarTitle({
      title: options.searchKey + '-搜索结果'
    })
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

  getData: function() {
    // 
    var self = this
    // 
    wx.showNavigationBarLoading()
    // 
    wx.request({
      url: requestUrl.stations,
      data: {
        name: self.data.searchKey,
        page: self.data.paging.page,
        page_size: self.data.paging.page_size
        // city_id: getApp().globalData.currentCityId || ''
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        var data = self.data.stations.concat(res.data.data)
        self.setData({
          stations: data,
          reqPaging: res.data.paging,
          isHideLoadMore: true
        })
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideNavigationBarLoading()
      },
    })
  },

  // 上拉加载更多
  onReachBottom: function () {
    var self = this
    var paging = self.data.paging
    var reqPaging = self.data.reqPaging
    // console.log(self.data.isHideLoadMore)
    if (!self.data.isHideLoadMore) return
    // console.log('加载更多')
    self.setData({
      isHideLoadMore: false
    })
    if (paging.page < Math.ceil(reqPaging.total / reqPaging.page_size)) {
      self.setData({
        paging: {
          page: paging.page + 1,
          page_size: 10
        }
      })
      self.getData()
    } else {
      self.setData({
        isHideLoadMore: true,
        loadedAll: true
      })
    }
  }

})