// pages/user/user.js
const Api = require('../../utils/api');
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkList: [],
    isAdmin: false
  },
  getWxOpenid: function () {
    var _this = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        var wx_openid = res.result.openid;
        // console.log(wx_openid);
        if (App.globalData.WX_OPENID == wx_openid) {
          _this.setData({
            isAdmin: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getWxOpenid(); //获取用户openid

    var data = {};
    data.sort = 'priority,desc'
    Api.requestGetApi('/api/content/links', data, this, this.linkSuccessFun);

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  linkSuccessFun: function (res, obj) {
    var array = res.data
    var linkList = obj.data.linkList;
    for (var i = 0; i < array.length; i++) {
      if (array[i].team == 'miniprogram') {
        array[i].weapp = JSON.parse(array[i].description);
        linkList.push(array[i]);
      }
    }
    obj.setData({
      linkList: linkList
    })
  },
  toLinkProgram: function (e) {
    var weapp = e.currentTarget.dataset.weapp;
    wx.navigateToMiniProgram({
      appId: weapp.appId,
      path: weapp.path
    })
  },
  toAdminPage: function () {
    App.getAdminInfo({
      success(res) {
        wx.navigateTo({
          url: '/pages/admin/dashBoard/dashBoard',
        })
      }
    });
  },
  getUserProfile: function () {

    var _this = this;
    App.getUserInfo({
      success(res) {
        _this.setData({
          userInfo: res
        })
      },
      fail() {
        wx.getUserProfile({
          desc: '用于完善会员资料',
          success: (res) => {
            App.saveWxUser(res.userInfo, {
              success(result) {
                // console.log(result);
                var userInfo = res.userInfo;
                userInfo._id = result;
                _this.setData({
                  userInfo: userInfo
                })
                wx.setStorageSync('userInfo', userInfo)
                App.globalData._ID = result;
                App.subMesage();
              }
            })
          },
          fail() {
            App.showToast("授权登陆失败")
          },
          complete() {
            App.hideLoading();
          }
        })
      }
    })
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
    //判断是否已经有用户信息
    var _this = this;
    App.getUserInfo({
      success(res) {
        _this.setData(({
          userInfo: res
        }))
      },
      fail() {}
    });
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
    return App.shareAppMessage('13号档案馆', '../../img/share_pictrue.jpg', '/pages/user/user');
  },
  onShareTimeline: function () {
    return App.sharePyqMessage('13号档案馆', '../../img/share_pictrue.jpg', '../../img/share_pictrue.jpg', '/pages/user/user');
  },
})