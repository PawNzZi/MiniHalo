// pages/article/article.js
/**
 * 由于服务器配置问题，对点赞和评论采取限制操作：在一定的时间内不能评论
 * 采用的解决方案是倒计时，和接收验证码一个道理，但是针对性的加强了，
 * 一般接收验证码倒计时时，返回上一页再进入又可以点击了。本方案是一直倒计时结束为止，除非删除小程序再进入
 * 用了github上的个开源项目，为了实现上面说的，业务有点绕
 * 现整理逻辑如下
 * 点赞：
 * 1.在app.js中配置一个全局变量
 * 2.点赞前现判断全局变量中是否存有该文章的点赞计时器id
 *  2.1如果有，说明正在倒计时，友情提示不允许点赞
 *  2.2如果没有，则调用Api
 * 3.回调函数中，创建一个计时器，并启动
 *  3.1倒计时开始，将当前文章id和计时器id存入当前全局变量中
 *  3.2倒计时结束后从全局变量中清除刚刚存入的数据
 * 评论：
 * 1.在app.js中配置两个全局变量，一个存储文章id和计时器对象，一个存储倒计时信息
 * 2.评论前判断全局变量中是否存有该文章的计时器对象
 *   2.1如果有不做任何操作
 *   2.2如果没有则调用API
 * 3.回调函数中，创建一个计时器，并启动
 *   3.1倒计时开始，将文章id和计时器对象和倒计时信息存在相应的全局变量中
 *   3.2正在倒计时，从倒计时信息全局变量读取数据，并渲染到UI上
 *   3.3倒计时结束，清除以上两个数据
 * 4.如果在倒计时未结束前退出详情页，再次进入该页面，会在onShow中判断
 *   4.1拿到当前倒计时对象
 *   4.2重新倒计时相关回调，在回调内读取数据或删除数据
 * 
 * 评论比较复杂，因为涉及到的场景较多。
 * 一个文章只会有一个点赞计时器和一个评论计时器，因为在创建启动前先做了判断，如果内存中有该文章id就说明有计时器正在运行，则不做任何操作
 * 
 */
const Api = require('../../utils/api');
const time = require('../../utils/time');
const App = getApp();
const Timer = require('../../utils/timer.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxTimerList: {},
    commentList: [],
    placeholder: '请输入评论',
    inputValue: '',
    disabled: false,
    // commentCountTime: 60,
    // likeCountTime: 60,
    isFixed: false,
    page: 0,
    parentId: -1,
    showReplyPopup: false,
    textareaValue: '',
    replyComment: '',
    warning: ['本小程序内的文章及其图片素材等均转载自互联网,如有侵权请通过小程序内客服联系告知', '本小程序内的所有文章不代表小程序主体及运营团队观点', '本小程序主体及运营团队坚持反对封建迷信，倡导科学', '本小程序主体及运营团队坚决拥护社会主义核心价值观', '本小程序内的所有文章内容不必当真或较真，当做故事看看即可，权当博君一笑', '如有用户与小程序内文章观点、想法、意见等出现分歧时，以用户自己观点为准，你说什么都对']
  },
  /**
   * 判断是否吸顶，吸顶后处理状态栏高度
   * @param {*} e 
   */
  stickyScroll: function (e) {
    // console.log(e);
    var isFixed = e.detail.isFixed;
    var statusSize = App.getStatusSize();
    if (isFixed) {
      this.setData({
        isFixed: isFixed,
        statusSize: statusSize + 10
      })
    } else {
      this.setData({
        isFixed: isFixed,
        statusSize: 10
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.postId;
    var statusSize = App.getStatusSize();
    this.setData({
      postId: postId,
      topSize: statusSize + 10
    })
    var data = {};
    Api.requestGetApi('/api/content/posts/' + postId, data, this, this.postSuccessFun);
    this.getCommentList(0);

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  /**
   * 查询post的评论
   * @param {*} page 
   */
  getCommentList: function (page) {
    //获取该post的评论
    var postId = this.data.postId;
    var comment = {};
    comment.sort = 'createTime,desc',
      comment.page = page;
    Api.requestGetApi('/api/content/posts/' + postId + '/comments/list_view', comment, this, this.commentSuccessFun);
  },
  /**
   * 查询评论成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  commentSuccessFun: function (res, obj) {
    // console.log(res);
    var array = res.data.content;
    var commentList = obj.data.commentList;
    if (array.length > 0) {
      for (var i = 0; i < array.length; i++) {
        //将时间戳转换为日期
        array[i].createTime = time.customFormatTime(array[i].createTime, 'Y-M-D  h:m:s');
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
    obj.setData({
      commentList: commentList,
      isEmpty: res.data.isEmpty,
      hasNext: res.data.hasNext,
      page: res.data.page
    })
  },
  /**
   * 文章详情成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  postSuccessFun: function (res, obj) {
    var article = res.data;
    article.createTime = time.customFormatTime(article.createTime, 'Y-M-D');
    obj.setData({
      article: article
    })
  },
  backPage: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 喜欢文章
   */
  likePost: function () {
    // var likeCountTime = this.data.likeCountTime;
    // if (likeCountTime != 60) {
    //   App.showToast("休息下，喝杯卡布奇诺");
    // } else {
    //   var postId = this.data.postId;
    //   var data = {};
    //   Api.requestPostApi('/api/content/posts/' + postId + '/likes', data, this, this.likePostSuccessFun);
    // }
    // var wxTimerList = this.data.wxTimerList;
    // console.log(wxTimerList)
    // console.log(App.globalData.LIKE_COUNT_OBJECT)
    var like_count = App.globalData.LIKE_COUNT_OBJECT;
    if (like_count.hasOwnProperty(this.data.postId)) {
      //如果对象中有该POSTID属性，则不允许调用Api
      App.showToast("休息下，喝杯卡布奇诺");
    } else {
      //如果对象中没有有该POSTID属性，则允许调用Api
      var postId = this.data.postId;
      var data = {};
      Api.requestPostApi('/api/content/posts/' + postId + '/likes', data, this, this.likePostSuccessFun);
    }
  },
  /**
   * 喜欢文章成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  likePostSuccessFun: function (res, obj) {
    App.showToast("哇塞！您成功喜欢了该文章");
    // var likeCountTime = obj.data.likeCountTime;
    // var setLikeCount = setInterval(function () {
    //   if (likeCountTime < 1) {
    //     clearInterval(setLikeCount);
    //     obj.setData({
    //       likeCountTime: 60
    //     })
    //   } else {
    //     likeCountTime = likeCountTime - 1
    //     obj.setData({
    //       likeCountTime: likeCountTime
    //     })
    //     console.log("likeCountTime:" + likeCountTime)
    //   }
    // }, 1000);

    var likeTimer = new Timer({
      beginTime: "00:00:10",
      name: 'likeTimer',
      complete: function () {
        // console.log('倒计时完成')
        //倒计时完成后将该文章从内存中移除
        var like_count = App.globalData.LIKE_COUNT_OBJECT;
        var postId = obj.data.postId;
        delete like_count[postId];
      },
      interval: 1,
      intervalFn: function () {

      }
    })
    likeTimer.start(obj);
    //启动计时器后将该计时器添加到内存中
    var like_count = App.globalData.LIKE_COUNT_OBJECT;
    var postId = obj.data.postId;
    like_count[postId] = likeTimer.intervarID;

  },
  /** 
   * 回复他人评论点击事件
   * @param {*} e 
   */
  replyComment: function (e) {
    // console.log(e);
    var _this = this;
    //先判断用户是否登陆
    App.getUserInfo({
      success(res) {
        // console.log(res);
        var replyCommentItem = e.detail.item;
        // console.log(replyCommentItem);
        var replyAuthor = '回复@' + replyCommentItem.author + ':'
        var replyContent = replyCommentItem.content;
        _this.setData({
          replyCommentItem: replyCommentItem,
          showReplyPopup: true,
          replyAuthor: replyAuthor,
          replyContent: replyContent
        });
      },
      fail() {
        App.showSinglModalFun('您尚未登陆，请先授权登陆', {
          success() {
            // console.log("dddd")
            App.showLoading("Loading");
            wx.getUserProfile({
              desc: '用于完善会员资料',
              success: (res) => {
                wx.setStorageSync('userInfo', res.userInfo)
                App.showToast("授权登陆成功")
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
      }
    })
  },
  /**
   * 关闭回复他人评论弹窗
   */
  onCloseReplyPopup: function () {
    this.setData({
      showReplyPopup: false,
      textareaValue: ''
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
    var _this = this ;
    var replyComment = _this.data.replyComment;
    replyComment = replyComment.replace(/\s+/g, '');
    if (!replyComment) {
      App.showToast("请输入评论");
    } else {
      App.msgSc(replyComment, {
        success(res) {
          // console.log(res)
          var userInfo = wx.getStorageSync('userInfo');
          var replyCommentItem = _this.data.replyCommentItem;
          _this.commitCommentApi(replyCommentItem.id, replyComment, userInfo.nickName, userInfo.avatarUrl, _this.replyCommentSuccessFun);
        }
      })

    }
  },
  /**
   * 回复别人的评论成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  replyCommentSuccessFun: function (res, obj) {
    obj.onCloseReplyPopup();
    App.showSinglModal('评论等待管理员审核，审核通过后立刻展示')
  },
  /**
   * 提交评论Api
   * @param {*} parentId 
   * @param {*} comment 
   * @param {*} author 
   * @param {*} authorUrl 
   */
  commitCommentApi: function (parentId, comment, author, authorUrl, callBack) {
    var postId = this.data.postId;
    var data = {};
    data.allowNotification = false;
    data.author = author;
    data.authorUrl = authorUrl;
    data.content = comment;
    data.email = "fwmeng_vip@163.com";
    data.parentId = parentId;
    data.postId = postId;
    Api.requestPostJSONApi('/api/content/posts/comments', data, this, callBack);
  },
  /**
   * 提交对文章的评论
   * @param {*} e 
   */
  commitComment: function (e) {
    var _this = this;

    var comment_count = App.globalData.COMMENT_COUNT_OBJECT;
    var COMMENT_TIMER = App.globalData.COMMENT_TIMER;
    if (comment_count.hasOwnProperty(_this.data.postId) && COMMENT_TIMER.hasOwnProperty(_this.data.postId)) {
      //如果对象中有该POSTID属性，则不允许调用Api
      App.showToast("休息下，喝杯卡布奇诺");
    } else {
      //如果对象中没有有该POSTID属性，则允许调用Api
      var comment = e.detail.value;
      comment = comment.replace(/\s+/g, '');
      if (!comment) {
        App.showToast("请输入评论");
      } else {
        //先判断用户是否登陆
        App.getUserInfo({
          success(res) {
            // console.log(res);
            App.msgSc(comment, {
              success(result) {
                // console.log(result)
                _this.commitCommentApi(null, comment, res.nickName, res.avatarUrl, _this.commitContentSuccessFun);
              }
            })
          },
          fail() {
            // console.log("没有用户信息")
            App.showSinglModalFun('您尚未登陆，请先授权登陆', {
              success() {
                // console.log("dddd")
                App.showLoading("Loading");
                wx.getUserProfile({
                  desc: '用于完善会员资料',
                  success: (res) => {
                    wx.setStorageSync('userInfo', res.userInfo)
                    App.showToast("授权登陆成功")
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
          }
        })
      }
    }

    // var comment = e.detail.value;
    // console.log(comment);
    // console.log(comment.length);
    // comment = comment.replace(/\s+/g, '');
    // if (!comment) {
    //   App.showToast("请输入评论");
    // } else {
    //   //先判断用户是否登陆
    //   App.getUserInfo({
    //     success(res) {
    //       // console.log(res);
    //       _this.commitCommentApi(null, comment, res.nickName, res.avatarUrl, _this.commitContentSuccessFun);
    //     },
    //     fail() {
    //       console.log("没有用户信息")
    //       App.showSinglModalFun('您尚未登陆，请先授权登陆', {
    //         success() {
    //           // console.log("dddd")
    //           App.showLoading("Loading");
    //           wx.getUserProfile({
    //             desc: '用于完善会员资料',
    //             success: (res) => {
    //               wx.setStorageSync('userInfo', res.userInfo)
    //               App.showToast("授权登陆成功")
    //             },
    //             fail() {
    //               App.showToast("授权登陆失败")
    //             },
    //             complete() {
    //               App.hideLoading();
    //             }
    //           })
    //         }
    //       })
    //     }
    //   })
    // }
  },
  /**
   * 评论成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  commitContentSuccessFun: function (res, obj) {
    obj.setData({
      inputValue: '',
      disabled: true
    });
    App.showSinglModal('评论等待管理员审核，审核通过后立刻展示')
    // var setCount = setInterval(function () {
    //   var countTime = obj.data.commentCountTime;
    //   if (countTime < 1) {
    //     clearInterval(setCount);
    //     obj.setData({
    //       commentCountTime: 60,
    //       disabled: false,
    //       placeholder: '请输入评论'
    //     });
    //   } else {
    //     countTime = countTime - 1
    //     obj.setData({
    //       commentCountTime: countTime,
    //       disabled: true,
    //       placeholder: countTime + '秒后再次评论'
    //     });
    //   }
    // }, 1000);

    var commentTimer = new Timer({
      beginTime: "00:00:20",
      name: 'commentTimer',
      complete: function () {
        // console.log('评论倒计时完成')
        //倒计时完成后将该文章从内存中移除
        var comment_count = App.globalData.COMMENT_COUNT_OBJECT;
        var postId = obj.data.postId;
        delete comment_count[postId];

        var COMMENT_TIMER = App.globalData.COMMENT_TIMER;
        delete COMMENT_TIMER[postId];
        obj.setData({
          disabled: false,
          placeholder: '请输入评论'
        })
      },
      interval: 1,
      intervalFn: function () {
        // console.log(App.globalData.COMMENT_TIMER[obj.data.postId])
        // console.log(App.globalData.COMMENT_COUNT_OBJECT[obj.data.postId])
        var postId = obj.data.postId;
        var COMMENT_TIMER = App.globalData.COMMENT_TIMER;
        COMMENT_TIMER[postId] = obj.data.wxTimerList;
        obj.setData({
          disabled: true,
          placeholder: COMMENT_TIMER[postId].commentTimer.wxTimerSecond + '秒后再评论'
        })
      }
    })
    commentTimer.start(obj);
    //启动计时器后将该计时器添加到内存中
    var comment_count = App.globalData.COMMENT_COUNT_OBJECT;
    var postId = obj.data.postId;
    comment_count[postId] = commentTimer;

    var COMMENT_TIMER = App.globalData.COMMENT_TIMER;
    COMMENT_TIMER[postId] = obj.data.wxTimerList;
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
    var _this = this;
    var postId = _this.data.postId;
    var comment_count = App.globalData.COMMENT_COUNT_OBJECT;
    var COMMENT_TIMER = App.globalData.COMMENT_TIMER;
    if (comment_count.hasOwnProperty(postId) && COMMENT_TIMER.hasOwnProperty(postId)) {
      var timer = comment_count[postId];
      timer.intervalFn = function () {
          // console.log("正在倒计时")
          _this.setData({
            disabled: true,
            placeholder: COMMENT_TIMER[postId].commentTimer.wxTimerSecond + '秒后再评论'
          })
        },
        timer.complete = function () {
          // console.log('评论倒计时完成')
          //倒计时完成后将该文章从内存中移除
          var comment_count = App.globalData.COMMENT_COUNT_OBJECT;
          delete comment_count[postId];

          var COMMENT_TIMER = App.globalData.COMMENT_TIMER;
          delete COMMENT_TIMER[postId];
          _this.setData({
            disabled: false,
            placeholder: '请输入评论'
          })
        }
    } else {
      // console.log("计时器对象不存在")
      this.setData({
        disabled: false,
        placeholder: '请输入评论'
      })
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
    if (hasNext) {
      var page = this.data.page;
      this.getCommentList(page + 1);
    } else {
      App.showToast("别拉了，拉完了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var article = this.data.article;
    var postId = this.data.postId;
    return App.shareAppMessage(article.title, article.thumbnail, '/pages/article/article?postId=' + postId);
  },
  onShareTimeline: function () {
    var article = this.data.article;
    var postId = this.data.postId;
    return App.sharePyqMessage(article.title, article.thumbnail, article.thumbnail, '/pages/article/article?postId=' + postId);
  },
})