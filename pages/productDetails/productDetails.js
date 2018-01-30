// pages/productDetails/productDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      details: JSON.parse(options.data) || {}
    })
    this.checkCart(this.data.details.id)
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

  // 检查当前商品是否加入购物车
  checkCart: function(id) {
    var carts = wx.getStorageSync('carts') || []
    if(carts.length) {
      for(let i = 0; i < carts.length; i++) {
        if(carts[i].id === id){
          this.setData({
            count: carts[i].count
          })
        }
      }
    }
  },
  
  // 商品数量变化
  onChangeNumber: function (e) {
    var self = this
    var carts = wx.getStorageSync('carts') || []
    // console.log(e)
    var proData = e.currentTarget.dataset.data
    var changeType = e.detail.type
    var count = e.detail.number

    if (carts.length) {
      var same = false
      var index = -1
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].id === proData.id) {
          same = true
          index = i
        }
      }
      // 是否存在商品
      if (same) {
        if (count) {
          carts[index].count = count
        } else {
          carts.splice(index, 1)
        }
      } else {
        proData['count'] = count
        carts.unshift(proData)
      }
    } else {
      proData['count'] = count
      carts.unshift(proData)
    }
    // 本地缓存购物车信息
    wx.setStorageSync('carts', carts)
    // console.log(wx.getStorageSync('carts'))
    //
    // self.getTotalPrice()
    // 修改菜单页购物车数据
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 1]  //当前界面
    var prevPage = pages[pages.length - 2]  //上一个页面
    prevPage.setData({
      carts: wx.getStorageSync('carts')
    })
    prevPage.getTotalPrice()
  }
})