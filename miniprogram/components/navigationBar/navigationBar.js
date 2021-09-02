// components/navigationBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    uid: {
      type: String,
      value: '0'
    },
    avator: {
      type: String,
      value: 'https://img.yzcdn.cn/vant/cat.jpeg'
    },
    backgroundColor: {
      type: String,
      value: '#4fc08d'
    },
    searchKey: {
      type: String
    },
    searchColor: {
      type: String,
      value: '#4fc08d'
    },
    disabled: {
      type: Boolean,
      value: true
    },
    optionArray: {
      type: Array
    },
    optionValue1: {
      type: Number,
      value: 0
    },
    type:{
      type:Number,
      value:0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () {
    var that = this;
    that.setNavSize();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    setNavSize: function () {
      var that = this,
        sysinfo = wx.getSystemInfoSync(),
        statusHeight = sysinfo.statusBarHeight,
        isiOS = sysinfo.system.indexOf('iOS') > -1,
        navHeight;
      if (!isiOS) {
        navHeight = 48;
      } else {
        navHeight = 44;
      }
      that.setData({
        status: statusHeight,
        navHeight: navHeight
      })
    },
    touchAvator: function (e) {
      var uid = e.currentTarget.dataset.uid;
      wx.navigateTo({
        url: '/pages/user/user?uid=' + uid,
      })
    },
    onSearch: function (e) {
      // console.log(e);
      var event = e.detail
      this.triggerEvent("onSearch", {
        event
      })
    },
    touchSearch: function () {
      if (this.properties.disabled) {
        wx.navigateTo({
          url: '/pages/search/search',
        })
      }
    },
    clearKeyWord: function () {
      this.triggerEvent("clearKeyWord")
    },
    dropdownChange: function (e) {
      // console.log(e.detail)
      var event = e.detail
      this.triggerEvent("dropdownChange", {
        event
      })
    },
    backPage:function(){
      // wx.switchTab({
      //   url: '/pages/table/index/index',
      // })
      wx.navigateBack({
        delta: 1,
      })
    },
  }
})