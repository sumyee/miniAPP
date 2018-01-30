// pages/details/details.js
var requestUrl = require('../../config.js');
var util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stationId: '',
    data: [], // 夜店数据
    feeds: [], // 评论
    is_reserve: 0, // 是否有预约订台
    reserve_id: '', // 进度ID
    time: '其他',
    pickerTime: '18:00',
    num: '其他',
    pickerNum: [],
    dateArr: [],
    numIndex: [0, 0],
    numArray: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']],
    startNum: '',
    endNum: '',
    openPopup: false,
    scrollY: true,
    selectNumType: '',
    selectTimeType: '',
    selectDate: '',
    selectTime: '',
    selectNum: '',
    selectYMD: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      stationId: options.id || ''
    })
    // 获取商家详情
    this.getData(options.id)
    // 获取评论列表
    // this.getFeeds(options.id)
    // 检查是否有预约订台
    this.checkReserve(options.id)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // getData
  getData: function (id) {
    var self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: requestUrl.stations + '/' + id,
      header: {
        token: wx.getStorageSync('token') || '',
        userid: wx.getStorageSync('userid') || ''
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        var _data = res.data.data
        self.setData({
          data: _data || []
        })
        //
        self.getMoreDate(_data.config.now, _data.config.reserve_advance_days)
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },

  // 喜欢
  likeTap: function (e) {
    var self = this
    var token = wx.getStorageSync('token')
    var userid = wx.getStorageSync('userid')
    if (!token) return
    var id = self.data.stationId
    // 
    wx.request({
      url: requestUrl.feeds,
      data: {
        ['type']: 'LIKE',
        super_id: id
      },
      header: {
        token: token,
        userid: userid
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        //
        self.getData(id)
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  // 取消喜欢
  cancelLikeTap: function (e) {
    var self = this
    var token = wx.getStorageSync('token')
    var userid = wx.getStorageSync('userid')
    if (!token) return
    var id = self.data.stationId
    // 
    wx.request({
      url: requestUrl.unlike,
      data: {
        ['type']: 'LIKE',
        station_id: id
      },
      header: {
        token: token,
        userid: userid
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res)
        //
        self.getData(id)
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  // 获取日期
  getMoreDate: function (str, num) {
    // console.log(num)
    var arr = []
    num = num ? num : 1
    for (let i = 0; i < num; i++) {
      arr.push({
        YMD: util.getMoreYMD(str, i),
        date: util.getMoreDate(str, i)
      })
    }
    // console.log(arr)
    this.setData({
      dateArr: arr
    })
  },

  // 查看所有评论
  gotoComments: function (e) {
    var id = e.currentTarget.dataset.data
    wx.navigateTo({
      url: '../comments/comments?id=' + id
    })
  },

  // 当前用户在此商家是否有预约订台
  checkReserve: function (id) {
    var self = this
    if (!wx.getStorageSync('token')) return
    wx.request({
      url: requestUrl.stations_reserve,
      data: {
        station_id: id
      },
      header: {
        token: wx.getStorageSync('token') || ''
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        self.setData({
          is_reserve: res.data.data.is_reserve || 0,
          reserve_id: res.data.data.is_reserve ? res.data.data.reserve_id : ''
        })
        // console.log('stations_reserve', res)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 查看进度
  showReserve: function () {
    var self = this
    wx.navigateTo({
      url: '../menu/menu?data=' + JSON.stringify(self.data.data.station) + '&tab=0&reserve_id=' + self.data.reserve_id
    })
  },

  // popup
  showPopup: function () {
    // console.log(this.data)
    if (!wx.getStorageSync('token')) {
      app.reauthorize(() => {
        self.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      })
      wx.showToast({
        title: '您还没登录',
        icon: 'loading'
      })
      return
    }
    this.setData({
      openPopup: true
    })
  },

  // preview
  previewImage: function (e) {
    // console.log(e)
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
    app.previewImage(current, urls)
  },

  // 查看地图
  showMap: function (e) {
    // console.log(e)
    var data = e.currentTarget.dataset || {}
    var latitude = Number(data.latitude) || ''
    var longitude = Number(data.longitude) || ''
    var name = data.name || ''
    var address = data.address || ''
    if (latitude && longitude) {
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        name: name,
        address: address
      })
    }
  },

  // 打电话
  phoneCall: function (e) {
    // console.log(e)
    var phone = e.currentTarget.dataset.phone || ''
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  // 选择时间picker
  bindSelectTimeChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value,
      selectTime: e.detail.value
    })
  },

  // 人数选择 change
  bindSelectNumChange: function (e) {
    // console.log(e)
    var val = e.detail.value
    this.setData({
      num: (val[0] + 1) + '~' + (val[0] + val[1] + 1),
      selectNum: (val[0] + 1) + '~' + (val[0] + val[1] + 1)
    })
  },

  // 人数选择 列 change
  bindSelectNumColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    var data = {
      numArray: this.data.numArray,
      numIndex: this.data.numIndex
    }
    data.numIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        // console.log(data.numIndex)
        switch (data.numIndex[0]) {
          case data.numIndex[0]:
            // console.log(data.numIndex[0])
            var arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']
            arr.splice(0, data.numIndex[0])
            data.numArray[1] = arr
        }
    }
    // 
    this.setData(data)
  },

  // 选择日期
  selectDateFn: function (e) {
    this.setData({
      selectDate: e.currentTarget.dataset.date,
      selectYMD: e.currentTarget.dataset.ymd
    })
    // console.log(this.data.selectDate)
  },

  // 选择时间
  selectTimeFn: function (e) {
    var time = e.currentTarget.dataset.time
    if (time !== '其他') {
      this.setData({
        time: '其他',
        selectTimeType: ''
      })
    } else {
      this.setData({
        selectTimeType: '其他'
      })
    }
    this.setData({
      selectTime: time
    })
    // console.log(this.data.selectTime)
  },

  // 选择到场人数
  selectNumFn: function (e) {
    var num = e.currentTarget.dataset.num
    if (num !== '其他') {
      this.setData({
        num: '其他',
        selectNumType: ''
      })
    } else {
      this.setData({
        selectNumType: '其他'
      })
    }
    this.setData({
      selectNum: num
    })
    // console.log(this.data.selectNum)
  },

  // 确认订台
  comfirmBtn: function (e) {
    var _date = this.data.selectDate
    var _YMD = this.data.selectYMD
    var _time = this.data.selectTime
    var _num = this.data.selectNum
    // console.log(_date, _time, _num)
    if (!_date) {
      wx.showToast({
        icon: 'loading',
        title: '请选择订台日期',
      })
      return
    }
    if (!_time || _time === '其他') {
      wx.showToast({
        icon: 'loading',
        title: '请选择到场时间',
      })
      return
    }
    if (!_num || _num === '其他') {
      wx.showToast({
        icon: 'loading',
        title: '请选择到场人数',
      })
      return
    }
    // 
    this.setData({
      openPopup: false
    })
    // 预约订台数据
    var oData = {
      station: this.data.data.station,
      date: _date,
      YMD: _YMD,
      time: _time,
      num: _num
    }
    wx.navigateTo({
      url: '../bookReservation/bookReservation?data=' + JSON.stringify(oData)
    })
  },

  // 跳转到酒水菜单
  goToMenu: function (e) {
    var self = this
    wx.navigateTo({
      url: '../menu/menu?data=' + JSON.stringify(self.data.data.station) + (self.data.reserve_id ? '&reserve_id=' + self.data.reserve_id : ''),
    })
  },

  // 跳转到顾问列表
  gotoConsultant: function() {
    wx.navigateTo({
      url: '../consultant/consultant?id=' + this.data.stationId
    })
  }

})