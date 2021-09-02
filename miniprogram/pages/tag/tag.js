// pages/tag/tag.js
const Api = require('../../utils/api');
const App = getApp();
const time = require('../../utils/time')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: [],
    page: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '#' + options.name,
    })
    this.setData({
      slug: options.slug
    });
    this.postByTagSlug(0, options.slug);
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  postByTagSlug: function (page, slug) {
    var data = {};
    data.page = page;
    data.size = 15;
    data.sort = 'visits,desc'
    Api.requestGetApi('/api/content/tags/' + slug + '/posts', data, this, this.slugSuccessFun);
  },
  slugSuccessFun: function (res, obj) {
    var array = res.data.content;
    var articleList = obj.data.articleList;
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        array[i].createTime = time.customFormatTime(array[i].createTime, 'Y-M-D')
      }
    }
    articleList = articleList.concat(array);
    obj.setData({
      articleList: articleList,
      hasNext: res.data.hasNext,
      page: res.data.page,
      isEmpty: res.data.isEmpty
    });
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
    if (hasNext) {
      var page = this.data.page;
      var slug = this.data.slug;
      this.postByTagSlug(slug, page + 1);
    } else {
      App.showToast("别拉了，拉完了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return App.shareAppMessage('13号档案馆','../../img/share_pictrue.jpg','/pages/tag/tag');
  },
  onShareTimeline:function(){
    return App.sharePyqMessage('13号档案馆','../../img/share_pictrue.jpg','../../img/share_pictrue.jpg','/pages/tag/tag');
  },
})