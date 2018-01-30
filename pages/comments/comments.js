// pages/comments/comments.js
var requestUrl = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    comments: [],
    isHideLoadMore: true,
    loadedAll: false,
    paging: {
      page: 1,
      page_size: 10
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      id: options.id
    })
    // 获取评论列表
    this.getFeeds(this.data.id)
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this
    var paging = self.data.paging
    if (self.data.loadedAll) return
    // console.log('加载更多')
    self.setData({
      isHideLoadMore: false,
      paging: {
        page: paging.page + 1,
        page_size: 10
      }
    })
    self.getFeeds()
  },

  // 获取评论列表
  getFeeds: function () {
    var self = this
    var id = self.data.id
    // 
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // 
    wx.request({
      url: requestUrl.stationsFeeds + '/' + id,
      data: self.data.paging,
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        var data = self.data.comments.concat(res.data.data)
        self.setData({
          comments: data,
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

  // preview
  previewImage: function (e) {
    var current = e.currentTarget.dataset.current
    var urlsArr = e.currentTarget.dataset.urls
    var urls = []
    if (urlsArr.length) {
      for (let i = 0; i < urlsArr.length; i++) {
        urls.push(urlsArr[i].url)
      }
    } else {
      urls = [current]
    }
    getApp().previewImage(current, urls)
  }
})