// pinyin
const pinyin = require('../../utils/pinyin.js')
const config = require('../../config.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCities()
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

  // 获取所有城市
  getCities: function () {
    var self = this
    // loading
    wx.showLoading({
      title: '加载中...',
      mask: false
    })
    wx.request({
      url: config.cityUrl,
      // data: ,
      header: {},
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        // console.log(res)
        var _cities = res.data.data || []
        self.formatCities(_cities)
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },

  // 格式化数据
  formatCities: function (cities) {
    var self = this
    var _cities = cities
    var newCityArr = []

    _cities.sort(this.compare('english_name'))
    // 
    var firstLetter = ''
    // var alphabet = ''
    // var datas = []

    var newCities = []
    _cities.forEach(function (city) {
      var first = self.getFirstLetter(city.english_name)
      var oCity = {
        alphabet: '',
        datas: []
      }
      if (firstLetter === first) {
        newCities.forEach(function (newC) {
          if (newC.alphabet === firstLetter) {
            newC.datas.push(
              {
                name: city.name,
                code: city.id
              }
            )
          }
        })
        oCity.datas.push(
          {
            name: city.name,
            code: city.id
          }
        )
        return
      } else {
        firstLetter = first
        oCity.alphabet = first
        oCity.datas.push(
          {
            name: city.name,
            code: city.id
          }
        )
      }
      //
      newCities.push(oCity)
    })
    //
    self.setData({
      cities: newCities
    })
  },

  // 获取首字母
  getFirstLetter: function (name) {
    var nameArray = name.split('');
    var firstLetter = nameArray[0].toUpperCase();
    return firstLetter;
  },

  // 排序
  compare: function (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop].toUpperCase();
      var val2 = obj2[prop].toUpperCase();
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },

  // 
  itemTap: function (e) {
    // console.log(e)
    var self = this
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 1]  //当前界面
    var prevPage = pages[pages.length - 2]  //上一个页面
    var selectCity = e.detail.data
    var selectCityId = e.detail.id
    prevPage.setData({
      currentCity: selectCity,
      currentCityId: selectCityId
    })
    prevPage.checkCurCity()
    wx.navigateBack()
  }
})