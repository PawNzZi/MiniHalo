// app.js
App({
  onLaunch() {
    //检查是否有新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log('请求完新版本信息的回调')
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
        })
      }
    })
  },
  globalData: {
    AUTHORIZATIONS: 'caonimachoubi2'
  },
  setNavSize: function () {
    // var that = this                
    var sysinfo = wx.getSystemInfoSync(),
      statusHeight = sysinfo.statusBarHeight,
      isiOS = sysinfo.system.indexOf('iOS') > -1,
      navHeight;
    if (!isiOS) {
      navHeight = 48;
    } else {
      navHeight = 44;
    }
    return statusHeight + navHeight

  },
  getStatusSize: function () {
    var sysinfo = wx.getSystemInfoSync();
    var statusHeight = sysinfo.statusBarHeight;
    return statusHeight;
  },
  //无icon有遮罩Toast
  showToast: function (msg) {
    wx.showToast({
      title: msg,
      complete: (res) => {},
      duration: 1000,
      fail: (res) => {},
      icon: 'none',
      mask: true,
      success: (res) => {},
    })
  },
  //有遮罩的loding
  showLoading: function (msg) {
    wx.showLoading({
      title: msg,
      mask: true
    })
  },
  //取消loding
  hideLoading: function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 1500)

  },
  //有icon有遮罩Toast
  showIconToast: function (msg) {
    wx.showToast({
      title: msg,
      complete: (res) => {},
      fail: (res) => {},
      icon: 'loading',
      mask: true,
      success: (res) => {},
    })
  },
  hideToast: function () {
    wx.hideLoading({
      success: (res) => {},
    })
  },
  //操作”确认“按钮逻辑的Modal
  showModal: function (msg, handler) {
    wx.showModal({
      title: '温馨提示',
      content: msg,
      success(res) {
        if (res.confirm) {
          handler.success();
        }
      }
    })
  },
  //操作”确认“按钮逻辑的Modal且无”取消“按钮
  showSinglModalFun: function (msg, handler) {
    wx.showModal({
      title: '温馨提示',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          handler.success();
        }

      }
    })
  },
  showSinglModal: function (msg) {
    wx.showModal({
      title: '温馨提示',
      content: msg,
      showCancel: false,
      success(res) {
        console.log(res)
      }
    })
  },
  /**
   * 封装小程序分享对象
   * @param {*} title 
   * @param {*} imageUrl 
   * @param {*} path 
   */
  shareAppMessage: function (title, imageUrl, path) {
    var shareAppMessage = {
      title: title,
      imageUrl: imageUrl,
      path: path,
    }
    return shareAppMessage;
  },
  sharePyqMessage: function (title, imageUrl, imagePreviewUrl, path) {
    var sharePyqMessage = {
      title: title,
      imageUrl: imageUrl,
      imagePreviewUrl: imagePreviewUrl,
      path: path,
    }
    return sharePyqMessage;
  },
  getUserInfo:function(handler){
    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      handler.success(userInfo);
    }else{
      handler.fail();
    }
  },
  getAdminInfo:function(handler){
    var admin = wx.getStorageSync('admin');
    if(admin){
      handler.success(admin);
    }else{
      wx.redirectTo({
        url: '/pages/admin/adminLogin/adminLogin',
      })
    }
  }
})
