// pages/search/search.js
const Api = require('../../utils/api');
const App = getApp();
const time = require('../../utils/time');
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    optionArray: [
      { text: '默认排序', value: 0 ,sort:'' },
      { text: '文章热度', value: 1 ,sort:'visits,desc'},
      { text: '文章喜欢', value: 2 ,sort:'likes,desc'},
      { text: '更新日期', value: 3 ,sort:'createTime,desc'},
    ],
    articleList:[],
    sort:'createTime,desc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var navSize = App.setNavSize();
    this.setData({navSize:navSize})
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  /**
   * 输入框搜索关键词
   * @param {*} e 
   */
  onSearch:function(e){
    // console.log(e.detail.event);
    var articleList = this.data.articleList ;
    articleList.length = 0 ;
    var keyword = e.detail.event;
    var sort = this.data.sort;
    keyword = keyword.replace(/\s+/g, '');
    if(!keyword){
       App.showToast("请输入关键词")
       this.setData({isEmpty:false,keyword:keyword});
    }else{
      this.setData({keyword:keyword,articleList:articleList,sort:sort});
      this.postSearch(keyword,0,sort);
      
    }
  },
  /**
   * 调用接口
   * @param {*} keyword 
   * @param {*} page 
   * @param {*} sort 
   */
  postSearch:function(keyword,page,sort){
    var data = {};
    data.keyword = keyword;
    data.page = page;
    data.size = 15 ;
    data.sort = sort ;
    Api.requestPostApi('/api/content/posts/search',data,this,this.postSuccessFun);
  },
  /**
   * 搜索成功接口回调
   * @param {*} res 
   * @param {*} obj 
   */
  postSuccessFun:function(res,obj){
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
   * 切换搜索条件
   * @param {*} e 
   */
  dropdownChange:function(e){
    // console.log(e.detail.event)
    var value = e.detail.event;
    var articleList = this.data.articleList ;
    var keyword = this.data.keyword;
    articleList.length = 0 ;
    var array = this.data.optionArray;
    var object = {};
    for(var i = 0;i<array.length;i++){
      if(array[i].value == value){
       object = array[i];
      }
    }
    this.setData({articleList:articleList,page:0,sort:object.sort});
    if(keyword){
      keyword = keyword.replace(/\s+/g, '');
      if(!keyword){
         App.showToast("请输入关键词")
         this.setData({isEmpty:false});
      }else{
        this.postSearch(keyword,0,object.sort);
      }
     
    }
    
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
      var keyword = this.data.keyword;
      var sort = this.data.sort;
      this.postSearch(keyword,page+1,sort);
    }else{
      App.showToast("别拉了，拉完了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return App.shareAppMessage('13号档案馆','../../img/share_pictrue.jpg','/pages/search/search');
  },
  onShareTimeline:function(){
    return App.sharePyqMessage('13号档案馆','../../img/share_pictrue.jpg','../../img/share_pictrue.jpg','/pages/search/search');
  },
})