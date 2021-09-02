// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      // console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'release-lrn2i',
        traceUser: true,
      })
    }
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
    WX_OPENID : 'o7Vka4y6Kv6yLrULn_uKuuYGGvMo',//管理员的openid
    AUTHORIZATIONS: 'caonimachoubi2',
    LIKE_COUNT_OBJECT: {}, //存储文章点赞的文章id和对应的计时器id
    COMMENT_COUNT_OBJECT: {}, //存储文章评论的文章id和对应的计时器id
    COMMENT_TIMER: {}, //存储当前计时器倒计时内容
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
    }, 500)

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
        // console.log(res)
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
  /**
   * 封装小程序android分享朋友圈对象
   * @param {*} title 
   * @param {*} imageUrl 
   * @param {*} imagePreviewUrl 
   * @param {*} path 
   */
  sharePyqMessage: function (title, imageUrl, imagePreviewUrl, path) {
    var sharePyqMessage = {
      title: title,
      imageUrl: imageUrl,
      imagePreviewUrl: imagePreviewUrl,
      path: path,
    }
    return sharePyqMessage;
  },
  /**
   * 判断用户信息是否存在
   * @param {*} handler 
   */
  getUserInfo: function (handler) {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      if (userInfo.hasOwnProperty('nickName') && userInfo.hasOwnProperty('avatarUrl')) {
        handler.success(userInfo);
      } else {
        handler.fail();
      }

    } else {
      handler.fail();
    }
  },
  /**
   * 判断管理员信息是否存在
   * @param {*} handler 
   */
  getAdminInfo: function (handler) {
    var admin = wx.getStorageSync('admin');
    if (admin) {
      if (admin.hasOwnProperty('access_token')) {
        handler.success(admin);
      } else {
        wx.redirectTo({
          url: '/pages/admin/adminLogin/adminLogin',
        })
      }

    } else {
      wx.redirectTo({
        url: '/pages/admin/adminLogin/adminLogin',
      })
    }
  },
  /**
   * 随机颜色
   */
  radomColor: function () {
    this.r = Math.floor(Math.random() * 192);
    this.g = Math.floor(Math.random() * 192);
    this.b = Math.floor(Math.random() * 192);
    var color = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ')';
    return color;
  },
  /**
   * 判断内容是否为空
   * @param {*} text 
   */
  checkTextIsEmpty: function (text) {
    var result;
    if (text) {
      result = text.replace(/\s+/g, '');
    } else {
      result = ''
    }
    // console.log(result)
    return result;
  },
  /**
   * 上传图片
   */
  uploadThumb: function (handler) {
    // console.log("上传图片")
    var _this = this;
    _this.showModal('确定上传图片', {
      success() {
        _this.getAdminInfo({
          success(admin) {
            wx.chooseImage({
              success(res) {
                _this.showLoading("Loading");
                const tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                  url: 'https://13archives.lingyikz.cn/api/admin/attachments/upload',
                  filePath: tempFilePaths[0],
                  name: 'file',
                  header: {
                    'admin-authorization': admin.access_token
                  },
                  success(result) {
                    if (result.errMsg == 'uploadFile:ok') {
                      var data = result.data;
                      data = JSON.parse(data);
                      if (data.status == 200) {
                        _this.hideLoading();
                        handler.success(data.data);
                      } else {
                        _this.showToast(data.message);
                      }
                    } else {
                      _this.showToast("上传失败")
                    }
                  },
                  fail() {
                    _this.showToast("上传失败")
                  },
                })
              }
            })
          }
        })
      }
    })
  },
  /**
   * 检测评论是否敏感
   * @param {*} content 
   * @param {*} handler 
   */
  msgSc:function(content,handler){
    var _this = this ;
    wx.cloud.callFunction({
      name: 'msgSC',
      data: {
        text: content
      },
      complete: res => {
        // console.log(res.result)
        if(res.result.data.errCode == 87014){
          //命中敏感词
          _this.showToast(res.result.msg)
        }else if(res.result.data.errCode == 0){
          //未命中敏感词
          handler.success(res.result);
        }else{
          //其他错误
          _this.showToast(res.result.msg)
        }
      }
    })
  }

})