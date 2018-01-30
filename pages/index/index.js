//index.js
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');
var requestUrl = require('../../config.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    currentCity: app.globalData.currentCity,
    isHideLoadMore: true,
    loadedAll: false,
    cityData: {
      city_id: '',
      lng: '',
      lat: ''
    },
    paging: {
      page: 1,
      page_size: 10
    },
    reqPaging: {},
    currentCityId: '',
    lng: '',
    lat: '',
    stations: []
  },
  // 
  onLoad: function () {
    // this.getLocaotionAuth()
    this.initBMap()
  },
  //
  onShow: function () {
    // this.checkCurCity()
  },

  // 获取定位权限
  getLocaotionAuth: function () {
    var self = this
    wx.getSetting({
      success: res => {
        // 获取定位权限
        // console.log(res)
        if (!res.authSetting['scope.userLocation']) {
          wx.showToast({
            title: '定位未授权...'
          })
          self.setData({
            currentCity: '选择城市'
          })
          wx.authorize({
            scope: 'scope.userLocation',
            success: function () {
              // console.log('success')
              wx.getLocaotionAuth()
            },
            fail: function () {
              // console.log('fail')
            },
            complete: function () {
              // console.log('complete')
            }
          })
        } else {
          self.initBMap()
        }
      }
    })
  },

  // 获取当前定位城市夜店列表
  getData: function () {
    var self = this
    // 
    if (!self.data.cityData.city_id) {
      wx.showToast({
        title: '请选择城市',
        icon: 'loading'
      })
      wx.stopPullDownRefresh()
      return
    }
    self.setData({
      loadedAll: false
    })
    // 
    wx.showNavigationBarLoading()
    // 
    var requestData = Object.assign(self.data.cityData, self.data.paging)
    // 如果定位已授权，取带距离数据，否则取普通数据
    var resUrl = self.data.cityData.lng ? requestUrl.nearmeStations : requestUrl.stations
    wx.request({
      url: resUrl,
      data: requestData,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log('success', res)
        var data = self.data.stations.concat(res.data.data)
        self.setData({
          stations: data,
          isHideLoadMore: true
        })
        if (!res.data.data.length && data.length) {
          self.setData({
            loadedAll: true
          })
        }
      },
      fail: function (res) {
        // console.log('fail', res)
      },
      complete: function (res) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },
    })
  },

  // 新建百度地图对象 
  initBMap: function () {
    var self = this
    var BMap = new bmap.BMapWX({
      ak: 'bm3b3uwRX7A9KIjkfAqG8hzixMSdGBeR'
    })
    BMap.regeocoding({
      fail: function (data) {
        wx.showToast({
          title: '定位失败'
        })
        self.setData({
          currentCity: '选择城市'
        })
      },
      success: function (data) {
        var _data = data.originalData.result
        var adcodeArr = _data.addressComponent.adcode.split('')
        adcodeArr.splice(adcodeArr.length - 2, 2, '00')
        app.globalData.currentCity = _data.addressComponent.city
        app.globalData.currentCity = _data.addressComponent.city
        app.globalData.cityData = {
          city_id: adcodeArr.join(''),
          lng: _data.location.lng,
          lat: _data.location.lat
        }
        // console.log(app.globalData.cityData)
        self.setData({
          currentCity: _data.addressComponent.city,
          lng: _data.location.lng,
          lat: _data.location.lat,
          cityData: {
            city_id: adcodeArr.join(''),
            lng: _data.location.lng,
            lat: _data.location.lat
          }
        })
        // wx.showToast({
        //   title: _data.addressComponent.city
        // })
        //
        self.getData()
      }
    })
  },

  // 检查当前城市
  checkCurCity: function () {
    var self = this
    var isCurrentCity = this.data.currentCity === app.globalData.currentCity
    var currentCityId = this.data.currentCityId

    // 更换城市 重新拉取数据
    if (!isCurrentCity && currentCityId) {
      // 
      app.globalData.currentCity = this.data.currentCity
      // 
      self.setData({
        cityData: {
          city_id: self.data.currentCityId,
          lng: self.data.lng,
          lat: self.data.lat
        },
        stations: [],
        paging: {
          page: 1,
          page_size: 10
        }
      })
      //
      self.getData()
    }
  },
  //事件处理函数
  bindViewTap: function (event) {
    // console.log(event.currentTarget.dataset.data)
    wx.navigateTo({
      url: '../details/details'
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var self = this
    self.setData({
      stations: [],
      paging: {
        page: 1,
        page_size: 10
      }
    })
    self.getData()
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

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  }
})
