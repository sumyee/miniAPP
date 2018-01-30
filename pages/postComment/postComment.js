// pages/postComment/postComment.js
var requestUrl = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    comment: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
   * 评论输入框
   */
  commentInput: function (e) {
    var self = this
    self.setData({
      comment: e.detail.value
    })
  },

  // 发表评论
  postComment: function () {
    var self = this
    var comment = self.data.comment
    var id = self.data.id
    if (!comment) {
      wx.showToast({
        title: '请输入评论',
        icon: 'loading'
      })
      return
    }
    // 
    wx.showLoading({
      title: '发表评论...',
      mask: true
    })
    // 
    wx.request({
      url: requestUrl.feeds,
      data: {
        ['type']: 'ORDER',
        super_id: id,
        text: comment
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        if (res.data.data && res.data.data ==='SUCCESS') {
          wx.showToast({
            title: '评论成功',
            icon: 'loading'
          })
          setTimeout(function () {
            // 
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'loading'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '评论失败',
          icon: 'loading'
        })
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  }
})