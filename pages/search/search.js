// pages/search/search.js
const {unique} = require('../../utils/util.js') // 数组去重
var requestUrl = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '',
    searchDatas: [],
    focus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _searchDatas = wx.getStorageSync('searchDatas') || []
    this.setData({
      searchDatas: _searchDatas
    })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 点击搜索事件
   */
  confirmSearch: function () {

    // console.log('搜索', this.data.searchKey)
    var self = this
    var searchKey = self.data.searchKey
    if (!searchKey) return
    // 本地存储搜索记录
    var searchDatas = wx.getStorageSync('searchDatas') || []
    searchDatas.unshift(searchKey)    
    wx.setStorageSync('searchDatas', unique(searchDatas))
    // 更新搜索记录数据
    self.setData({
      searchDatas: unique(searchDatas)
    })
    // 
    wx.navigateTo({
      url: '../../pages/searchResult/searchResult?searchKey=' + searchKey
    })
  },

  /**
   * 绑定输入框 获取值
   */
  searchInput: function (e) {
    this.setData({
      searchKey: e.detail.value
    })
  },

  // 历史记录 搜索
  historyTap: function (e) {
    var historyVal = e.currentTarget.dataset.data || ''
    this.setData({
      searchKey: historyVal,
      focus: true
    })
    // this.confirmSearch()
  },

  // 清除所有搜索记录
  clearAll: function () {
    var self = this
    wx.showModal({
      title: '提示',
      content: '确认删除全部历史记录',
      cancelColor: '#666',
      confirmColor: '#fcb903',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          try {
            wx.removeStorageSync('searchDatas')
          } catch (e) {
            // Do something when catch error
          }
          // 更新数据
          self.setData({
            searchDatas: []
          })
          // 删除成功提示
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  // 删除单个历史记录
  deleteOne: function (e) {
    var delVal = e.currentTarget.dataset.data || ''
    var searchStorage = wx.getStorageSync('searchDatas') || []
    var index = searchStorage.indexOf(delVal)
    if (index > -1) {
      searchStorage.splice(index, 1)
      // 删除数据后存到本地
      wx.setStorageSync('searchDatas', searchStorage)
      // 更新数据
      this.setData({
        searchDatas: wx.getStorageSync('searchDatas') || []
      })
    }
  }
})