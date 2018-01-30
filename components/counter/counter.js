// components/counter/counter.js
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [],
  properties: {
    number: {
      type: [Number, String],
      value: 0,
      observer: function (newVal) {
        this.setData({
          number: parseInt(newVal, 10)
        })
      }
    },
    maxNum: {
      type: [Number, String],
      value: 1,
      observer: function (newVal) {
        this.setData({
          max: parseInt(newVal, 10)
        })
      }
    },
    minNum: {
      type: [Number, String],
      value: 0,
      observer: function (newVal) {
        this.setData({
          min: parseInt(newVal, 10)
        })
      }
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    addHandler(e) {
      let minNum = this.data.minNum;
      let maxNum = this.data.maxNum;
      let disabled = this.data.disabled;
      if (maxNum <= this.data.number || disabled) return;
      this.setData({
        number: ++this.data.number
      })
      this.triggerEvent('changenumber', {
        e,
        number: this.data.number,
        minNum,
        maxNum,
        type: 'add'
      });
    },
    minusHandler(e) {
      let minNum = this.data.minNum;
      let maxNum = this.data.maxNum;
      let disabled = this.data.disabled;
      if (minNum >= this.data.number || disabled) return;
      this.setData({
        number: --this.data.number
      });
      this.triggerEvent('changenumber', {
        e,
        number: this.data.number,
        minNum,
        maxNum,
        type: 'minus'
      });
    }
  }
})
