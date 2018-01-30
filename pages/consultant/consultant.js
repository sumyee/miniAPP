// pages/consultant/consultant.js
var requestUrl = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    advisers: [],
    canSelect: false,
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
    // console.log(options)
    this.setData({
      id: options.id,
      canSelect: options.canSelect ? true : false
    })
    this.getData(this.data.id)
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

  // 上拉加载更多
  onReachBottom: function () {
    var self = this
    var paging = self.data.paging
    if (self.data.loadedAll || !self.data.isHideLoadMore) return
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

  /**
   * 获取数据
   */
  getData: function () {
    var self = this
    var id = self.data.id
    var stationData = {
      station_id: id
    }
    var reqData = Object.assign(stationData, self.data.paging)
    wx.request({
      url: requestUrl.advisers,
      data: reqData,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        var data = self.data.advisers.concat(res.data.data)
        self.setData({
          advisers: data || [],
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
      complete: function(res) {},
    })
  },

  // 选择顾问
  selectAdviser: function (e) {
    var self = this
    wx.showModal({
      title: '提示',
      content: '取消重新订台可以更换夜店顾问，一旦到场消费后则无法进行更换',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#FCB903',
      success: function(res) {
        if (res.confirm) {
          // console.log(e)
          var pages = getCurrentPages()
          var prevPage = pages[pages.length - 1]  //当前界面
          var prevPage = pages[pages.length - 2]  //上一个页面
          var consultant = e.currentTarget.dataset.name
          var consultantId = e.currentTarget.dataset.id
          prevPage.setData({
            consultant: consultant,
            consultantId: consultantId
          })
          wx.navigateBack()
        }
      }
    })
  }
})