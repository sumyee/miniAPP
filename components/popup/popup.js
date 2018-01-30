// components/popup/popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isOpen: {
      type: Boolean,
      value: false
    },
    popupType: {
      type: String,
      value: 'bottom'
    },
    mask: {
      type: Boolean,
      value: true
    },
    maskLock: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    fnMaskClick: function (e) {
      // console.log(e)
      // e.preventDefault()
      this.setData({
        isOpen: false
      })
      if (!this.data.maskLock) {
        
      }
    }
  }
})
