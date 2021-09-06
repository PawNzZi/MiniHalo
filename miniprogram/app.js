// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      // console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'xxx',
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
    var _this = this ;
    this.getUserInfo({
      success(res){
        _this.globalData._ID = res._id;
        // console.log(res._id);
      },
      fail(){}
    })

  },
  globalData: {
    WX_OPENID: 'xxx', //管理员的openid
    AUTHORIZATIONS: 'xxx',
    LIKE_COUNT_OBJECT: {}, //存储文章点赞的文章id和对应的计时器id
    COMMENT_COUNT_OBJECT: {}, //存储文章评论的文章id和对应的计时器id
    COMMENT_TIMER: {}, //存储当前计时器倒计时内容
    CATEGORY_SLUG:'',
    IS_SUBMESSAGE:false,
    SUB_ID :'xxxx'
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
        }else{
          handler.fail();
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
  msgSc: function (content, handler) {
    var _this = this;
    _this.showLoading("Loading");
    wx.cloud.callFunction({
      name: 'msgSC',
      data: {
        text: content
      },
      complete: res => {
        _this.hideLoading();
        // console.log(res.result)
        if (res.result.result.suggest === 'risky') {
          //命中敏感词
          _this.showToast('请注意用词')
        } else if (res.result.result.suggest === 'pass') {
          //未命中敏感词
          handler.success(res.result);
        } else {
          //其他错误
          _this.showToast("请注意用词")
        }
      }
    })
  },

  // articleSc: function (content, handler) {
  //   var _this = this ;
  //   _this.showLoading("Loading");
  //   var data = {};
  //   data.content = content ;
  //   wx.request({
  //     url: 'https://api.lingyikz.cn/textcensoring/getresult',
  //     method: 'POST',
  //     data: data,
  //     header: {
  //       'Content-Type': 'application/json',
  //     },
  //     success:function(res){
  //       // console.log(res);
  //       if(res.statusCode == 200 && res.data.errcode == 0){
  //          handler.success(res.data.result)
  //       }else{
  //         _this.showToast('检测文章失败')
  //       }
  //     },
  //     fail:function(res){
  //       _this.showToast('检测文章失败')
  //     },
  //     complete:function(){
  //       _this.hideLoading();
  //     }
  //   })

  // }
  /**
   * 利用云函数调取第三方api检测文章是否有敏感词
   * @param {*} content 
   * @param {*} handler 
   */
  articleSC: function (content, handler) {
    var _this = this;
    _this.showLoading("检测中");
    wx.cloud.callFunction({
      name: 'articleSC',
      data: {
        body: {
          content: content
        },
      },
      success: res => {
        if (res.result.err_code == 0) {
          handler.success(res.result.hits);
        } else {
          _this.showToast("检测失败");
        }
      },
      fail: res => {
        _this.showToast("检测失败");
      },
      complete: res => {
        _this.hideLoading();
      }
    })
  },
  /**
   * 利用云函数生成小程序码
   * @param {*} param 
   * @param {*} page 
   * @param {*} handler 
   */
  getProgramCode: function (param, page, handler) {
    var _this = this;
    _this.showLoading("生成中");
    wx.cloud.callFunction({
      name: 'getQrcode',
      data: {
        param,
        page
      },
      success: res => {
        // handler.success(res);
        if (res.result.errCode == 0) {
          handler.success(res.result.buffer);
        } else {
          _this.showToast("生成失败");
        }
      },
      fail: res => {
        _this.showToast("生成失败");
      },
      complete: res => {
        _this.hideLoading();
      }
    })
  },
  /**
   * 保存图片到本地
   * @param {*} base64 
   * @param {*} title 
   * @param {*} handler 
   */
  saveBase64File: function (base64, title, handler) {
    var _this = this;
    _this.showLoading("保存中");
    var manager = wx.getFileSystemManager();
    manager.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/' + title + '_13archives.png',
      data: base64,
      encoding: 'base64',
      success: res => {
        // console.log(wx.env.USER_DATA_PATH + '/' + title + '_13archives.png');
        // console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/' + title + '_13archives.png',
          success: function () {
            _this.showToast("保存成功")
            handler.success();
          },
          fail: function (err) {
            // _this.showToast("保存失败")
            wx.getSetting({
              success: result => {
                let authSetting = result.authSetting
                if (!authSetting['scope.writePhotosAlbum']) {
                  _this.showModal('您未开启保存图片到相册的权限，请点击确定去开启权限！',{
                    success(){
                      wx.openSetting();
                    },
                    fail(){
                      _this.showToast("保存失败")
                    }
                  })
                }else{
                  _this.showToast("保存失败")
                }
              }
            })
          },
          complete: function () {
            _this.hideLoading();
          }
        })
      },
      fail: err => {
        // console.log(err)
        _this.hideLoading();
        _this.showToast("操作失败")
      },
    })
  },
  /**
   * 保存海报到本地
   * @param {*} path 
   * @param {*} handler 
   */
  savePainteFile:function(path,handler){
    var _this = this ;
    _this.showLoading("保存中");
    wx.saveImageToPhotosAlbum({
      filePath: path,
      success: function () {
        _this.showToast("保存成功")
        handler.success();
      },
      fail: function (err) {
        // _this.showToast("保存失败")
        wx.getSetting({
          success: result => {
            let authSetting = result.authSetting
            if (!authSetting['scope.writePhotosAlbum']) {
              _this.showModal('您未开启保存图片到相册的权限，请点击确定去开启权限！',{
                success(){
                  wx.openSetting();
                },
                fail(){
                  _this.showToast("保存失败")
                }
              })
            }else{
              _this.showToast("保存失败")
            }
          }
        })
      },
      complete: function () {
        _this.hideLoading();
      }
    })
  },
  /**
   * 初始化绘制内容 
   * @param {*} article 
   * @param {*} qrcode 
   */
  initPainter: function (article,qrcode) {
    this.showLoading("生成中");
    var painter = {
      width: '750rpx',
      height: '1434rpx',
      background: "https://image.lingyikz.cn/97c4f59f-670b-4837-8935-bb611f560d2c_thumb.jpg",
      views: [{
          type: 'image',
          url: '',
          css: {
            width: '750rpx',
            height: '420rpx',
          },
        },
        {
          type: 'text',
          text: '',
          css: {
            width: '688rpx',
            top: '440rpx',
            left: '30rpx',
            right: '32rpx',
            maxLines: 1,
            fontWeight: 'bold',
            fontSize: '44rpx',
            color: '#495060'
          }
        },
        {
          type: 'text',
          text: '',
          css: {
            width: '688rpx',
            top: '500rpx',
            left: '30rpx',
            right:'32rpx',
            fontSize: '38rpx',
            color: '#495060',
            maxLines: 10,
            textStyle: 'fill',
            lineHeight: '40rpx'
          }
        },
        {
          type: 'text',
          text: '(扫码进入小程序查看完整或更多内容)',
          css: {
            top: '910rpx',
            fontSize: '38rpx',
            color: '#495060',
            width: '688rpx',
            align: 'center',
            left:'450rpx',
            fontWeight: 'bold',
          }
        },
        {
          type: 'image',
          url: '',
          css: {
            top: '1000rpx',
            left: '450rpx',
            width: '250rpx',
            height: '250rpx'
          }

        },
        {
          type: 'text',
          text: '13号档案馆',
          css: {
            top: '1050rpx',
            left: '110rpx',
            fontWeight: 'bold',
            fontSize: '44rpx',
            color: '#495060'
          }

        },
        {
          type: 'text',
          text: '揭秘这世上不为人知的秘密',
          css: {
            top: '1170rpx',
            left: '70rpx',
            fontSize: '30rpx',
            color: '#495060'
          }
        },
        {
          type: 'text',
          text: '@13archives.lingyikz.cn © 2021 13号档案馆',
          css: {
            bottom: '30rpx',
            fontSize: '34rpx',
            color: '#495060',
            left: '375rpx',
            align: 'center',
          }
        }
      ]
    }
    painter.views[0].url = article.thumbnail;
    painter.views[1].text = article.title;
    painter.views[2].text = article.summary+'...';
    painter.views[4].url = 'data:image/png;base64,'+qrcode;
    
    // console.log(painter)
    this.hideLoading();
    return painter ;
  },
  /**
   * 用户授权登陆保存到云数据库
   * @param {*} userInfo 
   * @param {*} handler 
   */
  saveWxUser:function(userInfo,handler){
    var _this = this ;
    _this.showLoading("Login")
    wx.cloud.callFunction({
      name:'wxLogin',
      data:{
        userInfo:userInfo
      },success:function(res){
        handler.success(res.result);
      },fail:function(res){
        _this.showToast("授权失败")
      },complete:function(){
        _this.hideLoading();
      }
    })
  },
  /**
   * 提交用户消息订阅
   */
  subMesage:function(handler){
    var _this = this ;
    // console.log('subMesage:',_this.globalData._ID);
    if(_this.globalData._ID && !_this.globalData.IS_SUBMESSAGE){
      _this.showModal('勾选‘总是保持以上选择’，订阅后文章更新早知道', {
        success() {
          _this.acceptSubMessage(handler);
        },
        fail(){
          // console.log(_this.globalData.IS_SUBMESSAGE)
          // _this.globalData.IS_SUBMESSAGE = true
        }
      })
    }
  },
  /**
   * 申请订阅
   * @param {*} handler 
   */
  acceptSubMessage:function(handler){
    var _this = this ;
    var subId = _this.globalData.SUB_ID
    wx.requestSubscribeMessage({
      tmplIds: [subId],
      success(res) {
        // console.log(res);
        if(res[subId] === 'accept'){
          // console.log("同意订阅")
          handler&&handler.success(res);
          wx.cloud.callFunction({
            name:'subMessage',
            data:{
              subId:subId,
              _id:_this.globalData._ID
            },
            success:function(res){
              // console.log(res)
            _this.globalData.IS_SUBMESSAGE = true;
          
            },fail:function(res){
              // console.log(res)
            }
          })
        }else {
          handler&&handler.fail();
        }
      }
    })
  }
})