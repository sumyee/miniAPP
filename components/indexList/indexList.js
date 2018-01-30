Component({
  behaviors: [],
  properties: {
    alpha: {
      type: String,
      value: 'none'
    },
    windowHeight: {
      type: String,
      value: 'none'
    },
    currentCity: {
      type: Object,
      value: {
        name: '重新定位'
      }
    },
    cities: {
      type: Array,
      value: []
    }
  },
  data: {
    list: []
  },
  attached: function () {
    try {
      var res = wx.getSystemInfoSync()
      this.pixelRatio = res.pixelRatio;
      // this.apHeight = 34 / this.pixelRatio;
      // this.offsetTop = 160 / this.pixelRatio;
      this.apHeight = 16.5;
      this.offsetTop = 70;
      this.setData({ windowHeight: res.windowHeight + 'px' })
    } catch (e) {

    }
    //
  },
  methods: {
    handlerAlphaTap(e) {
      let { ap } = e.target.dataset;
      this.setData({ alpha: ap });
    },
    handlerMove(e) {      
      let { list } = this.data;
      let moveY = e.touches[0].clientY;
      let rY = moveY - this.offsetTop;
      if (rY >= 0) {
        let index = Math.ceil((rY - this.apHeight) / this.apHeight) - 1;
        if (index < 0) {
          this.setData({ alpha: 'Top' });
        } else if (0 <= index < list.length) {
          let nonwAp = list[index];
          nonwAp && this.setData({ alpha: nonwAp.alphabet });
        }
      }
      // console.log(e)
    },
    onTap: function (e) {
      var selectData = e.currentTarget.dataset.data
      var selectId = e.currentTarget.dataset.id
      // detail对象，提供给事件监听函数
      var detail = {
        data: selectData,
        id: selectId
      }
      var option = {} // 触发事件的选项
      // console.log(e)
      this.triggerEvent('tapevent', detail, option)
    }
  }
})