// pages/admin/post/postDetail/postDetail.js
const Api = require('../../../../utils/api');
const App = getApp();
const {
  pinyin
} = require('pinyin-pro');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    title: '',
    content: '',
    commentChecked: true,
    topChecked: false,
    categoryIds: [],
    tagIds: []
  },
  //获取标题
  getInputTitle: function (e) {
    var slug = pinyin(e.detail, {
      toneType: 'none'
    });
    slug = slug.replace(/\s+/g, '-')
    this.setData({
      title: e.detail,
      slug: slug
    });
  },

  //获取内容
  getInputContent: function (e) {
    var content = e.detail.value;
    var summary;
    if (content.length > 140) {
      summary = content.slice(0, 139);
    } else {
      summary = content;
    }

    this.setData({
      content: content,
      zhaiyaoValue: summary
    });
    // console.log(this.data.content)
  },
  //获取别名
  getInputSlug: function (e) {
    this.setData({
      slug: e.detail.value
    });
  },
  //获取 封面图
  getInputThumb: function (e) {
    this.setData({
      thumb: e.detail.value
    });
  },
  //获取摘要
  getInputZhaiyao: function (e) {
    this.setData({
      zhaiyaoValue: e.detail.value
    });
  },
  //获取是否打开评论
  onCommentChange: function (e) {
    // console.log(e);
    this.setData({
      commentChecked: e.detail
    })
  },
  //获取是否置顶
  onTopChange: function (e) {
    // console.log(e);
    this.setData({
      topChecked: e.detail
    })
  },
  //获取分类
  onCategoryChange: function (e) {

    this.setData({
      categoryIds: e.detail
    })
  },
  //获取标签
  onTagChange: function (e) {

    this.setData({
      tagIds: e.detail
    })
  },
  onClosePopup: function () {
    this.setData({
      showPopup: false
    })
  },
  /**
   * 打开侧面设置面板
   */
  publishBtn: function () {
    this.setData({
      showPopup: true
    })
  },

  sureBtn: function () {
    // this.setData({
    //   showPopup: true
    // })
    var _this = this;
    var content = _this.data.content;
    var title = _this.data.title;
    if (App.checkTextIsEmpty(title) && App.checkTextIsEmpty(content)) {
      App.articleSC(content, {
        success(hits) {
          // console.log(hits);
          if (hits.length > 0) {
            //检测有敏感词
            var keyword = [];
            for (var i = 0; i < hits.length; i++) {
              for (var j = 0; j < hits[i].word_array.length; j++) {
                keyword.push(hits[i].word_array[j])
              }
            }
            App.showModal('敏感词:' + keyword.toString(), {
              success() {
                _this.setData({
                  showPopup: true
                })
              }
            })
          } else {
            //检测无敏感词
            _this.setData({
              showPopup: true
            })
          }
        },
      })
    } else {
      App.showToast("标题或内容为空");
    }

    // var _this = this;
    // var content = _this.data.content;
    // var title = _this.data.title;
    // if (App.checkTextIsEmpty(title) && App.checkTextIsEmpty(content)) {

    //   App.articleSc(content, {
    //     success(res) {
    //       var hits = res.hits;
    //       if (hits.length > 0) {
    //         var keyword = [];
    //         for (var i = 0; i < hits.length; i++) {
    //           for (var j = 0; j < hits[i].word_array.length; j++) {
    //             keyword.push(hits[i].word_array[j])
    //           }
    //         }
    //         App.showModal('敏感词:' + keyword.toString(), {
    //           success() {
    //             _this.setData({
    //               showPopup: true
    //             })
    //           }
    //         })
    //       } else {
    //         _this.setData({
    //           showPopup:true
    //         })
    //       }

    //     }
    //   })
    // } else {
    //   App.showToast("标题或内容为空")
    // }
  },
  /**
   * 保存到草稿箱
   */
  save: function () {
    var index = this.data.index;
    var _this = this;
    if (index == 0) {
      //新建文章
      App.showModal('确定将该文章保存到草稿箱？', {
        success() {
          _this.createPost('DRAFT');
        }
      })

    } else {
      //更新文章
      App.showModal('确定将该文章保存到草稿箱？', {
        success() {
          _this.upDatePost('DRAFT');
        }
      })
    }
  },
  /**
   * 批量发送模板消息
   * @param {*} postId 
   */
  sendSubMessage:function(postId){
    var subId = App.globalData.SUB_ID
    var _this = this ;
    var summary = _this.data.zhaiyaoValue;
    var title = _this.data.title;
    if(title.length>20){
       title = title.slice(0,15)+ '...'
    }
    if(summary.length>20){
      summary = summary.slice(0,15)+'...';
    }
    wx.cloud.callFunction({
      name:'sendMessage',
      data:{
        subId:subId,
        title:title,
        summary:summary,
        tip:'点击，立刻进入小程序查看',
        postId:postId,
      },
      success:function(res){
        // console.log(res)
      },fail:function(res){
        // console.log(res)
      }
    })
  },
  /**
   * 发布
   */
  publish: function () {
    var index = this.data.index;
    var _this = this;
    if (index == 0) {
      //新建文章
      App.showModal('确定将该文章公开发布？', {
        success() {
          _this.createPost('PUBLISHED');
        }
      })

    } else {
      //更新文章
      App.showModal('确定将该文章公开发布？', {
        success() {
          _this.upDatePost('PUBLISHED');
        }
      })
    }
  },
  /**
   * 新建文章到发布或草稿箱
   */
  createPost: function (status) {
    var title = this.data.title;
    var content = this.data.content;
    if (App.checkTextIsEmpty(title) && App.checkTextIsEmpty(content)) {

      var data = {};
      data.categoryIds = this.formatConversion(this.data.categoryIds, 'Number'); //分类
      data.createTime = new Date().getTime(); //创建时间
      data.disallowComment = !this.data.commentChecked; //是否打开评论
      data.editorType = this.data.editorType; //编辑类型
      data.originalContent = content; //文章内容
      data.slug = this.data.slug; //文章别名
      data.status = status; //文章状态，动态传入
      data.summary = this.data.zhaiyaoValue; //文章摘要
      data.tagIds = this.formatConversion(this.data.tagIds, 'Number'); //标签
      data.title = title; //标题
      data.thumbnail = this.data.thumb; //封面图
      data.topped = this.data.topChecked; //是否置顶
      data.topPriority = 0;
      // data.editTime = new Date().getTime();
      // console.log(data);
      Api.requestPostJSONApi('/api/admin/posts/?autoSave=false', data, this, this.createPostSuccess);
    } else {
      App.showToast("标题或内容不能为空")
    }
  },
  /**
   * 创建文章成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  createPostSuccess: function (res, obj) {
    obj.sendSubMessage(res.data.id);
    App.showSinglModalFun("操作成功", {
      success() {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**
   * 更新文章到发布或草稿箱
   */
  upDatePost: function (status) {
    var title = this.data.title;
    var content = this.data.content;
    if (App.checkTextIsEmpty(title) && App.checkTextIsEmpty(content)) {
      var postId = this.data.postId;
      var data = {};
      data.categoryIds = this.formatConversion(this.data.categoryIds, 'Number'); //分类
      // data.createTime = this.data.createTime;//创建时间
      data.disallowComment = !this.data.commentChecked; //是否打开评论
      data.editorType = this.data.editorType; //编辑类型
      data.originalContent = content; //文章内容
      data.slug = this.data.slug; //文章别名
      data.status = status; //文章状态，动态传入
      data.summary = this.data.zhaiyaoValue; //文章摘要
      data.tagIds = this.formatConversion(this.data.tagIds, 'Number'); //标签
      data.title = title; //标题
      data.thumbnail = this.data.thumb; //封面图
      data.topped = this.data.topChecked; //是否置顶
      data.topPriority = 0;
      data.editTime = new Date().getTime();
      // console.log(data);
      Api.requestPutJSONApi('/api/admin/posts/' + postId, data, this, this.updatePostSuccess);
    } else {
      App.showToast("标题或内容不能为空")
    }
  },
  /**
   * 更新成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  updatePostSuccess: function (res, obj) {
    App.showSinglModalFun("操作成功", {
      success() {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
    var index = options.index;
    if (index == 0) {
      wx.setNavigationBarTitle({
        title: '新建Post',
      })
      this.setData({
        index: index
      })
    } else {
      wx.setNavigationBarTitle({
        title: '修改Post',
      })
      var postId = options.postId;
      this.setData({
        postId: postId,
        index: index
      })
      var data = {};
      Api.requestGetApi('/api/admin/posts/' + postId, data, this, this.getPostDetailSuccess);
    }
  },
  /**
   * 获取文章详情
   * @param {*} res 
   * @param {*} obj 
   */
  getPostDetailSuccess: function (res, obj) {
    // var object = res.data.content;
    obj.setData({
      title: res.data.title,
      content: res.data.originalContent,
      thumb: res.data.thumbnail,
      slug: res.data.slug,
      categoryIds: obj.formatConversion(res.data.categoryIds, 'String'),
      tagIds: obj.formatConversion(res.data.tagIds, 'String'),
      zhaiyaoValue: res.data.summary,
      commentChecked: !res.data.disallowComment,
      topChecked: res.data.topped,
      createTime: res.data.createTime
    })
  },
  initData: function () {

    var data = {};
    data.sort = 'createTime,desc';
    data.more = true;
    Api.requestGetApi('/api/admin/categories', data, this, this.categorySuccess);
    Api.requestGetApi('/api/admin/tags', data, this, this.tagSuccess);
  },
  categorySuccess: function (res, obj) {
    obj.setData({
      categoryList: res.data,

    })
  },
  tagSuccess: function (res, obj) {
    obj.setData({
      tagList: res.data,

    })
  },
  /**
   * 标签和分类数组转换
   * @param {*} array 
   * @param {*} needType 
   */
  formatConversion: function (array, needType) {
    if (needType == 'String') {
      for (var i = 0; i < array.length; i++) {
        array[i] = String(array[i])
      }
    } else {
      for (var i = 0; i < array.length; i++) {
        array[i] = Number(array[i])
      }
    }
    return array;
  },
  /**
   * 上传图片
   */
  uploadThumb: function () {
    // console.log("上传图片")
    var _this = this;
    App.uploadThumb({
      success(res) {
        // console.log(res)
        _this.setData({
          thumb: res.thumbPath
        });
      }
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