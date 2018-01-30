Component({
  behaviors: [],
  properties: {
    text: {
      type: String,
      value: 0
    },
    type: {
      type: String,
      value: 'plain' // String 显示类型。目前支持 fill、plain、corner，对应实心标、镂空标、角标，默认值为 plain。
    },
    typeColor: {
      type: String,
      value: '#fcb903'
    },
    textColor: {
      type: String,
      value: '#ffffff'
    },
    _system_: {
      type: String,
      value: ''
    }
  },
  data: {},
  methods: {},
  attached: function () {
    let host = this;

    wx.getSystemInfo && wx.getSystemInfo({
      success: function (res) {
        host.setData({
          _system_: !!~res.system.indexOf('Android') ? 'android' : 'ios'
        });
      }
    });
  }
})