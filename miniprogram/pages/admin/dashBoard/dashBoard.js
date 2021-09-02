// pages/admin/dashBoard/dashBoard.js
const Api = require('../../../utils/api');
const App = getApp();
const time = require('../../../utils/time');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:0
  },
  /**
   * 选择title
   * @param {*} e 
   */
  selectTitle:function(e){
    var tag = e.currentTarget.dataset.tag;
    this.setData({tag:tag});
    if(tag == 0){
      this.postLatestTop();
    }else if(tag == 1){
      this.commentLatestTop();
    }else{
      this.logLatestTop();
    }
  },
  /**
   * 最近文章
   */
  postLatestTop:function(){
    var data = {};
    data.top = 8 ;
    Api.requestGetApi('/api/admin/posts/latest',data,this,this.postLatestTopSuccess);
  },
  /**
   * 最近文章回调
   * @param {*} res 
   * @param {*} obj 
   */
  postLatestTopSuccess:function(res,obj){
    // console.log(res);
    var array = res.data;
    for(var i = 0;i<array.length;i++){
      //将时间戳转换为日期
      array[i].createTime = time.customFormatTime(array[i].createTime, 'Y-M-D  h:m:s');
    }
    obj.setData({postList:array})
  },
  /**
   * 最近评论
   */
  commentLatestTop:function(){
    var data = {};
    data.top = 8 ;
    data.status = 'PUBLISHED';
    Api.requestGetApi('/api/admin/posts/comments/latest',data,this,this.commentLatestTopSuccess);
  },
  /**
   * 最近评论回调
   * @param {*} res 
   * @param {*} obj 
   */
  commentLatestTopSuccess:function(res,obj){
    // console.log(res);
    var array = res.data;
    for(var i = 0;i<array.length;i++){
      //将时间戳转换为日期
      array[i].createTime = time.customFormatTime(array[i].createTime, 'Y-M-D  h:m:s');
    }
    obj.setData({commentList:array});
  },
  /**
   * 最近操作
   */
  logLatestTop:function(){
    var data = {};
    data.top = 8 ;
    Api.requestGetApi('/api/admin/logs/latest',data,this,this.logLatestTopSuccess);
  },
  /**
   * 最近操作回调
   * @param {*} res 
   * @param {*} obj 
   */
  logLatestTopSuccess:function(res,obj){
    // console.log(res);
    var array = res.data;
    for(var i = 0;i<array.length;i++){
      //将时间戳转换为日期
      array[i].createTime = time.customFormatTime(array[i].createTime, 'Y-M-D  h:m:s');
      if (array[i].isAdmin) {
        array[i].email = '';
        array[i].authorUrl = 'http://cdn.lingyikz.cn/logo.jpg';
      } 
    }
    
    obj.setData({logList:array})
  },
  toArticleDetail:function(e){
    var postId = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '/pages/article/article?postId='+postId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this ;
    App.getAdminInfo({
      success(res){
        var data = {};
        Api.requestGetApi('/api/admin/statistics',data,_this,_this.statisticsSuccessFun);
        _this.postLatestTop();
      }
    });
    
  },
  statisticsSuccessFun:function(res,obj){
    // console.log(res)
    obj.setData({object:res.data});
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

})