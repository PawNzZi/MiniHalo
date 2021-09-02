const color = require('../../utils/color.js').color
const Api = require('../../utils/api');
const time = require('../../utils/time');
const App = getApp();
Page({
  data: {
    banner: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    list: [],
    articleList: [],
    categoryList: []
  },
  bannerClick:function(e){
    // console.log(e);
    var postId = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '/pages/article/article?postId='+postId,
    })
  },
  initData: function () {
    var data = {};
    data.sort = 'createTime,asc';
    data.more = true;
    var post = {};
    post.page = 0;
    post.size = 15;
    post.sort = 'createTime,desc';
    var banner = {};
    banner.page = 0;
    banner.size = 3;
    banner.sort = 'visits,desc'
    Api.requestGetApi('/api/content/posts', banner, this, this.bannerSuccessFun);
    Api.requestGetApi('/api/content/categories', data, this, this.categoriesSuccessFun);
    Api.requestGetApi('/api/content/tags', data, this, this.tagsSuccessFun);
    Api.requestGetApi('/api/content/posts', post, this, this.postsSuccessFun);
  },
  bannerSuccessFun: function (res, obj) {
    var banner = res.data.content;
    obj.setData({
      banner: res.data.content
    });
    var list = obj.data.list;
    //初始化第一张图片的缓存并设置
    this.downloadFile(list, banner[0].thumbnail);
  },
  categoriesSuccessFun: function (res, obj) {
    var array = res.data;
    array = array.splice(0, 4);
    obj.setData({
      categoryList: array
    })
  },
  tagsSuccessFun: function (res, obj) {
    obj.setData({
      tagsListA: res.data
    })
  },
  postsSuccessFun: function (res, obj) {
    var array = res.data.content;
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        //将时间戳转换为日期
        array[i].createTime = time.customFormatTime(array[i].createTime, 'Y-M-D');
      }
    }
    obj.setData({
      articleList: array
    })
  },

  toCategoryPage: function (e) {
    var slug = e.currentTarget.dataset.slug;
    wx.switchTab({
      url: '/pages/category/category?slug=' + slug,
    })
  },
  toTagPage: function (e) {
    var slug = e.currentTarget.dataset.slug;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/tag/tag?slug=' + slug + '&name=' + name,
    })
  },
  onLoad() {
    this.initData();
    var naviSize = App.setNavSize();
    this.setData({naviSize:naviSize})
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
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
    this.setData({
      autoplay: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      autoplay: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      autoplay: false
    })
  },
  /**
   * 自动轮播时监听
   * @param {*} e 
   */
  backgroundChange: function (e) {
    var list = this.data.list;
    // console.log(list.length);
    var banner = this.data.banner;
    // console.log(background.length);

    if (list.length != banner.length) {
      // console.log("没有缓存成功")
      //缓存与原数据长度不一致，需要每次轮播时下载缓存
      var imagePath = banner[e.detail.current].thumbnail;
      this.downloadFile(list, imagePath);
    } else {
      // console.log("缓存成功")
      //缓存与原数据长度一致，无需再次下载，直接调缓存
      var imagePath = list[e.detail.current];
      this.setBackGround(imagePath);
    }
  },
  /**
   * 设置NavigationBarColor和背景颜色
   * @param {*} tempFilePath 
   */
  setBackGround: function (tempFilePath) {
    var _this = this;
    color.colors(tempFilePath, 'myCanvas', {
      success: function (res) {
        const fontColor = color.isLight(res.dominant) ? "#000000" : "#ffffff";
        // console.log('fontColor:'+fontColor)
        const bgColor = color.rgbToHex(res.dominant);
        _this.setData({
          bgColor: bgColor,
          headBackground: bgColor
        });
        wx.setNavigationBarColor({
          backgroundColor: bgColor,
          frontColor: fontColor,
        })
        // console.log("bgColor: " + bgColor);
      },
      width: 375,
      height: 280
    });
  },
  /**
   * 下载图片并保存
   * @param {*} list 
   * @param {*} imagePath 
   */
  downloadFile: function (list, imagePath) {
    // console.log("downloadFile");
    // console.log("imagePath:"+imagePath);
    var u = this;
    wx.downloadFile({
      url: imagePath,
      success(res) {
        if (res.statusCode === 200) {
          list.push(res.tempFilePath);
          // console.log('每次缓存：'+ list);
          u.setData({
            list: list
          })
          u.setBackGround(res.tempFilePath);
        }
      },
      fail() {
        // console.log('fail')
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return App.shareAppMessage('13号档案馆', '../../img/share_pictrue.jpg', '/pages/index/index');
  },
  onShareTimeline:function(){
    return App.sharePyqMessage('13号档案馆','../../img/share_pictrue.jpg','../../img/share_pictrue.jpg','/pages/index/index');
  },
})