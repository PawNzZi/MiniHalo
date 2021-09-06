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
    activeKey:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var navSize = App.setNavSize();
    this.setData({navSize:navSize})
    //获取分类
    var data = {};
    data.sort='';
    data.more = true;
    Api.requestGetApi('/api/content/categories',data,this,this.categoriesSuccessFun);
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  /**
   * 获取分类成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  categoriesSuccessFun:function(res,obj){
    // var list = res.data ;
    // obj.getListForSulg(list[0].slug,0);
    obj.setData({categoryList:res.data})
  },
  /**
   * 根据分类查询文章
   * @param {*} slug 
   * @param {*} page 
   */
  getListForSulg:function(slug,page){
    // App.showLoading("Loading")
    var data = {};
    data.page= page;
    data.size= 15;
    data.sort= 'createTime,desc';
    Api.requestGetApi('/api/content/categories/'+ slug +'/posts',data,this,this.slugSuccessFun);
  },
  /**
   * 文章查询成功
   * @param {*} res 
   * @param {*} obj 
   */
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
  /**
   * 切换侧边栏
   * @param {*} e 
   */
  chargeSideBar:function(e){
    // console.log(e);
    var articleList = this.data.articleList;
    articleList.length = 0;
    var slug = e.currentTarget.dataset.slug;
    App.globalData.CATEGORY_SLUG = slug;
    this.setData({activeKey:e.detail,articleList:articleList,page:0,slug:slug})
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
    this.setCategoryTab();
  },
  setCategoryTab:function(){
    var slug = App.globalData.CATEGORY_SLUG;
    var categoryList = this.data.categoryList;
    if(!categoryList){
      //数据未加载完成
      // console.log("数据未加载完成");
     var _this = this;
     const Interval = setInterval(() => {
        categoryList = _this.data.categoryList;
        if(categoryList){
          clearInterval(Interval);
          if(slug == ''){
            //空字符说明非传值跳转
            _this.getListForSulg(categoryList[0].slug,0);
          }else if(slug === this.data.slug){}
          else{
            for(var i = 0;i<categoryList.length;i++){
              if(categoryList[i].slug == slug){
                _this.getListForSulg(slug,0);
                _this.setData({slug:slug,activeKey:i})
                return ;
              }
            }
          }
        }
      }, 500);
    }else{
      //数据已经加载完成
      // console.log("数据已经加载完成");
      var articleList = this.data.articleList;
      if(slug == ''){
        //空字符说明非传值跳转
        if(articleList.length<=0){
          // this.setData({articleList:[],page:0})
          this.getListForSulg(categoryList[0].slug,0);
        }
   
      }else if(slug === this.data.slug){}
      else {
        this.setData({articleList:[],page:0})
        for(var i = 0;i<categoryList.length;i++){
          if(categoryList[i].slug == slug){
            this.getListForSulg(slug,0);
            this.setData({slug:slug,activeKey:i})
            return ;
          }
        }
      }
    }
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