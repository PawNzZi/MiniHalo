// pages/admin/comment/comment.js
const Api = require('../../../utils/api');
const App = getApp();
const Time = require('../../../utils/time');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    commentList: [],
    keyword: '',
    showReplyPopup: false,
    textareaValue: '',
    replyComment: '',
    status: 'PUBLISHED',
    optionArray: [{
        text: '已通过',
        value: 0,
        status: 'PUBLISHED'
      },
      {
        text: '待审核',
        value: 1,
        status: 'AUDITING'
      },
      {
        text: '回收站',
        value: 2,
        status: 'RECYCLE'
      },
    ],
  },
  /**
   * 初始化关键词
   */
  clearKeyWord: function () {
    this.setData({
      keyword: ''
    });
  },
  /**
   * 输入框搜索关键词
   * @param {*} e 
   */
  onSearch: function (e) {
    // console.log(e.detail.event);
    var commentList = this.data.commentList;
    commentList.length = 0;
    var status = this.data.status;
    var keyword = e.detail.event;
    keyword = keyword.replace(/\s+/g, '');
    this.setData({
      keyword: keyword,
      commentList: commentList,
      status: status
    });
    this.commentSearch(keyword, 0, status);
  },
  /**
   * 切换搜索条件
   * @param {*} e 
   */
  dropdownChange: function (e) {
    // console.log(e.detail.event)
    var value = e.detail.event;
    var commentList = this.data.commentList;
    var keyword = this.data.keyword;
    commentList.length = 0;
    var array = this.data.optionArray;
    var object = {};
    for (var i = 0; i < array.length; i++) {
      if (array[i].value == value) {
        object = array[i];
      }
    }
    this.setData({
      commentList: commentList,
      page: 0,
      status: object.status,
      keyword: keyword
    });
    this.commentSearch(keyword, 0, object.status);
  },
  /**
   * 关键词搜索
   * @param {*} keyword 
   * @param {*} page 
   * @param {*} status 
   */
  commentSearch: function (keyword, page, status) {
    var data = {};
    data.keyword = keyword;
    data.page = page;
    data.sort = 'createTime,desc';
    data.size = 15;
    data.status = status;
    Api.requestGetApi('/api/admin/posts/comments', data, this, this.commentSuccess);
  },
  /**
   * 查询成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  commentSuccess: function (res, obj) {
    // console.log(res);
    var array = res.data.content;
    var commentList = obj.data.commentList;
    if (array.length > 0) {
      // console.log("长度大于0")
      for (var i = 0; i < array.length; i++) {
        array[i].createTime = Time.customFormatTime(array[i].createTime, 'Y-M-D  h:m:s');
        //判断是否为管理员，替换管理员头像
        if (array[i].isAdmin) {
          array[i].email = '';
          array[i].authorUrl = 'http://cdn.lingyikz.cn/logo.jpg';
        } else {
          if (array[i].email != 'fwmeng_vip@163.com') {
            //非小程序用户
            array[i].authorUrl = 'https:' + array[i].avatar;
          }
        }
      }
    }
    commentList = commentList.concat(array);
    // console.log(commentList);
    obj.setData({
      commentList: commentList,
      isEmpty: res.data.isEmpty,
      hasNext: res.data.hasNext,
      page: res.data.page
    });
  },
  /** 
   * 回复他人评论点击事件
   * @param {*} e 
   */
  replyComment: function (e) {
    // console.log(e);
    var _this = this;
    var replyCommentItem = e.detail.item;
    // console.log(replyCommentItem);
    // var replyAuthor = replyCommentItem.author 
    // var replyContent = replyCommentItem.content;
    // var replyTitle = replyCommentItem.post.title;
    _this.setData({
      replyCommentItem: replyCommentItem,
      showReplyPopup: true,
      // replyAuthor: replyAuthor,
      // replyContent: replyContent,
      // replyTitle:replyTitle
    });
  },
  /**
   * 通过审核
   * @param {*} e 
   */
  passComment: function (e) {
    // console.log(e);
    var _this = this;
    var replyCommentItem = e.detail.item;
    App.showModal('确定审核通过该评论？', {
      success() {
        // console.log("确定审核通过该评论？")
        _this.updateCommentStatus(replyCommentItem.id, 'PUBLISHED');
      }
    })
  },
  /**
   * 移到回收站
   * @param {*} e 
   */
  deleteComment: function (e) {
    // console.log(e);
    var _this = this;
    var replyCommentItem = e.detail.item;
    App.showModal('确定将该评论移到回收站？', {
      success() {
        // console.log("确定审核通过该评论？")
        _this.updateCommentStatus(replyCommentItem.id, 'RECYCLE');
      }
    })
  },
  /**
   * 更新评论状态
   * @param {*} commentId 
   * @param {*} status 
   */
  updateCommentStatus: function (commentId, status) {
    var data = {};
    Api.requestPutJSONApi('/api/admin/posts/comments/' + commentId + '/status/' + status, data, this, this.updateCommentSuccess);
  },
  /**
   * 更新评论状态成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  updateCommentSuccess: function (res, obj) {
    // console.log(res);
    App.showSinglModalFun('更新评论成功', {
      success() {
        var status = obj.data.status;
        var commentList = obj.data.commentList;
        commentList.length = 0;
        obj.setData({
          commentList: commentList
        })
        obj.commentSearch('', 0, status);
      }
    })


  },
  /**
   * 关闭回复他人评论弹窗
   */
  onCloseReplyPopup: function () {
    this.setData({
      showReplyPopup: false,
      textareaValue: '',
    });
  },
  /**
   * 获取输入的评论内容
   * @param {*} e 
   */
  onReplyInput: function (e) {
    // console.log(e);
    var replyComment = e.detail.value;
    this.setData({
      replyComment: replyComment
    });
  },
  /**
   * 提交回复别人的评论
   */
  replyCommitComment: function () {
    var replyComment = this.data.replyComment;
    replyComment = replyComment.replace(/\s+/g, '');
    if (!replyComment) {
      App.showToast("请输入评论");
    } else {
      var replyCommentItem = this.data.replyCommentItem;
      this.createPostComment(replyComment, replyCommentItem);
    }
  },
  /**
   * 管理员回复评论
   * @param {*} content 
   * @param {*} replyCommentItem 
   */
  createPostComment: function (content, replyCommentItem) {
    var data = {};
    data.allowNotification = false;
    data.author = replyCommentItem.author;
    data.authorUrl = replyCommentItem.authorUrl;
    data.content = content;
    data.email = '';
    data.parentId = replyCommentItem.id;
    data.postId = replyCommentItem.post.id;
    Api.requestPostJSONApi('/api/admin/posts/comments', data, this, this.replyCommentSuccessFun);
  },
  /**
   * 管理员回复评论成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  replyCommentSuccessFun: function (res, obj) {
    obj.onCloseReplyPopup();
    App.showToast("回复成功")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var navSize = App.setNavSize();
    this.setData({
      navSize: navSize
    })
    this.commentSearch('', 0, 'PUBLISHED');
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
      var status = this.data.status;
      var keyword = this.data.keyword;
      this.commentSearch(keyword, page + 1, status);
    } else {
      App.showToast("别拉了，拉完了")
    }
  },

})