// pages/admin/adminLogin/adminLogin.js
const App = getApp();
const Api = require('../../../utils/api');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    password:''
  },
  getUserName:function(e){
    console.log(e);
    var username = e.detail;

    this.setData({username:username})
  },
  getPassword:function(e){
    var password = e.detail;
    this.setData({password:password})
  },
  login:function(){
    var username = this.data.username;
    var password = this.data.password;
    username = username.replace(/\s+/g, '');
    password = password.replace(/\s+/g, '');
    if (!username || !password) {
      App.showToast("用户名或密码不能为空");
    } else {
      var data = {};
      data.username= username;
      data.password = password;
      Api.requestPostJSONApi('/api/admin/login',data,this,this.loginSuccessFun);
    }
   
  },
  loginSuccessFun:function(res,obj){
    wx.setStorageSync('admin', res.data);
    App.showToast('登陆成功');
    wx.redirectTo({
      url: '/pages/admin/dashBoard/dashBoard',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
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

  }
})