// pages/bookReservation/bookReservation.js
var requestUrl = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    consultant: '选择您的夜店驻场顾问',
    consultantId: '',
    phone: '',
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    var nData = JSON.parse(options.data) || {}
    this.setData({
      data: nData
    })
    // console.log(this.data.data)
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

  // phoneInput
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // remarkInput
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  // 提交预约
  comfirmBook: function (e) {
    var self = this
    var oData = {}
    var phone = self.data.phone
    if (!phone){
      wx.showToast({
        title: '请输入手机号',
        icon: 'loading'
      })
      return
    }
    if (!/^1[3|4|5|7|8][0-9]{9}$/.test(phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'loading'
      })
      return
    }

    // 数据
    oData = {
      station_id: self.data.data.station.id,
      phone: phone,
      people_number: self.data.data.num,
      arrive_time: self.data.data.YMD + ' ' + self.data.data.time,
      adviser_id: self.data.consultantId,
      remark: self.data.remark
    }
    // console.log(oData)

    // 提交预约
    wx.showLoading({
      title: '正在提交预约...',
      mask: true
    })
    wx.request({
      url: requestUrl.reserve,
      data: oData,
      header: {
        token: wx.getStorageSync('token') || 0
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // console.log(res)
        if(res.data.data){
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })
          // 转到夜店菜单进度
          wx.redirectTo({
            url: '../menu/menu?data=' + JSON.stringify(self.data.data.station) + '&tab=0&reserve_id=' + res.data.data.id
          })
        } else {
          wx.showToast({
            title: res.data.message || '提交失败',
            icon: 'loading'
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading()
      },
    })
  }
  
})