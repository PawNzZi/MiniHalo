// pages/category/category.js
const Api = require('../../utils/api');
const App = getApp();
const time = require('../../utils/time');
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    articleList:[],
    activeKey:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var navSize = App.setNavSize();
    this.setData({navSize:navSize})
    var data = {};
    data.sort='';
    data.more = true;
    Api.requestGetApi('/api/content/categories',data,this,this.categoriesSuccessFun);

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  categoriesSuccessFun:function(res,obj){
    var list = res.data ;
    obj.getListForSulg(list[0].slug,0);
    obj.setData({categoryList:res.data})
  },
  getListForSulg:function(slug,page){
    // App.showLoading("Loading")
    var data = {};
    data.page= page;
    data.size= 15;
    data.sort= 'visits,desc';
    Api.requestGetApi('/api/content/categories/'+ slug +'/posts',data,this,this.slugSuccessFun);
  },
  slugSuccessFun:function(res,obj){
    var array = obj.data.articleList;
    var articleList = res.data.content;
    if (articleList.length > 0) {
      for (var i = 0; i < articleList.length; i++) {
        //将时间戳转换为日期
        articleList[i].createTime = time.customFormatTime(articleList[i].createTime, 'Y-M-D');
      }
    }
    articleList = array.concat(articleList);
    obj.setData({articleList:articleList,hasNext:res.data.hasNext,page:res.data.page,isEmpty:res.data.isEmpty})
  },
  chargeSideBar:function(e){
    console.log(e);
    var articleList = this.data.articleList;
    articleList.length = 0;
    var slug = e.currentTarget.dataset.slug;
    this.setData({articleList:articleList,page:0,slug:slug})
    this.getListForSulg(slug,0);
    
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
    var hasNext = this.data.hasNext;
    if(hasNext){
      var page = this.data.page;
      var slug = this.data.slug;
      this.getListForSulg(slug,page+1);
    }else{
      App.showToast("别拉了，拉完了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return App.shareAppMessage('13号档案馆','../../img/share_pictrue.jpg','/pages/category/category');
  },
  onShareTimeline:function(){
    return App.sharePyqMessage('13号档案馆','../../img/share_pictrue.jpg','../../img/share_pictrue.jpg','/pages/category/category');
  },
})