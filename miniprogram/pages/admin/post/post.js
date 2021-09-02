// pages/admin/post/post.js
const Api = require('../../../utils/api');
const App = getApp();
const time = require('../../../utils/time');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    optionArray: [{
        text: '已发布',
        value: 0,
        status: 'PUBLISHED'
      },
      {
        text: '有密码',
        value: 1,
        status: 'INTIMATE'
      },
      {
        text: '草稿箱',
        value: 2,
        status: 'DRAFT'
      },
      {
        text: '回收站',
        value: 3,
        status: 'RECYCLE'
      },
    ],
    articleList: [],
    isEmpty: false,
    keyword: '',
    status: 'PUBLISHED',
    showShare: false,
    options: [{
        name: '新增文章',
        icon: 'http://cdn.lingyikz.cn/add.png',
      },
      {
        name: '更新文章',
        icon: 'http://cdn.lingyikz.cn/update.png',
      },
      {
        name: '删除文章',
        icon: 'http://cdn.lingyikz.cn/delete.png',
      },
      {
        name: '查看文章',
        icon: 'http://cdn.lingyikz.cn/detail.png',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var navSize = App.setNavSize();
    this.setData({
      navSize: navSize
    })
  },
  /**
   * 输入框搜索关键词
   * @param {*} e 
   */
  onSearch: function (e) {
    // console.log(e.detail.event);
    var articleList = this.data.articleList;
    articleList.length = 0;
    var keyword = e.detail.event;
    var status = this.data.status;
    this.setData({
      keyword: keyword,
      articleList: articleList,
      status: status
    });
    keyword = App.checkTextIsEmpty(keyword);
    this.postSearch(keyword, 0, status);

  },
  /**
   * 调用接口
   * @param {*} keyword 
   * @param {*} page 
   * @param {*} sort 
   */
  postSearch: function (keyword, page, status) {
    var data = {};
    data.keyword = keyword;
    data.page = page;
    data.size = 15;
    data.sort = 'createTime,desc';
    data.status = status;
    data.more = true;
    Api.requestGetApi('/api/admin/posts', data, this, this.postSuccessFun);
  },
  /**
   * 搜索成功接口回调
   * @param {*} res 
   * @param {*} obj 
   */
  postSuccessFun: function (res, obj) {
    var array = obj.data.articleList;
    var articleList = res.data.content;
    if (articleList.length > 0) {
      for (var i = 0; i < articleList.length; i++) {
        //将时间戳转换为日期
        articleList[i].createTime = time.customFormatTime(articleList[i].createTime, 'Y-M-D');
      }
    }
    articleList = array.concat(articleList);
    obj.setData({
      articleList: articleList,
      hasNext: res.data.hasNext,
      page: res.data.page,
      isEmpty: res.data.isEmpty
    })
  },
  /**
   * 切换搜索条件
   * @param {*} e 
   */
  dropdownChange: function (e) {
    // console.log(e.detail.event)
    var value = e.detail.event;
    var articleList = this.data.articleList;
    var keyword = this.data.keyword;
    articleList.length = 0;
    var array = this.data.optionArray;
    var object = {};
    for (var i = 0; i < array.length; i++) {
      if (array[i].value == value) {
        object = array[i];
      }
    }
    this.setData({
      articleList: articleList,
      page: 0,
      status: object.status
    });
    keyword = App.checkTextIsEmpty(keyword);
    this.postSearch(keyword, 0, object.status);
  },
  touchItem: function (e) {
    var item = e.detail.item;
    this.setData({
      item: item,
      showShare: true
    });
  },
  onClose: function () {
    this.setData({
      showShare: false
    });
  },
  onSelect: function (e) {
    // console.log(e);
    var _this = this;

    var index = e.detail.index;
    var item = this.data.item;
    var postId = item.id
    if (index == 0 || index == 1) {
      _this.onClose();
      wx.navigateTo({
        url: '/pages/admin/post/postDetail/postDetail?index=' + index + '&postId=' + postId,
      })
    } else if (index == 2) {
      App.showModal('确定将《' + item.title + '》移除到回收站？', {
        success() {
          var data = {};
          Api.requestPutJSONApi('/api/admin/posts/' + postId + '/status/RECYCLE', data, _this, _this.recyclePostkSuccess);
        }
      })
    } else {
      _this.onClose();
      wx.navigateTo({
        url: '/pages/article/article?postId=' + postId,
      })
    }
  },
  recyclePostkSuccess: function (res, obj) {
    obj.onClose();
    App.showToast("已移至回收站")
    setTimeout(function () {
      var status = obj.data.status;
      obj.setData({articleList:[]});
      obj.postSearch('', 0, status);
    }, 500)
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
    var status = this.data.status;
    this.postSearch('', 0, status);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      articleList: [],
      keyword: '',
    })
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
      var keyword = this.data.keyword;
      var status = this.data.status;
      this.postSearch(keyword, page + 1, status);
    } else {
      App.showToast("别拉了，拉完了")
    }
  },

})