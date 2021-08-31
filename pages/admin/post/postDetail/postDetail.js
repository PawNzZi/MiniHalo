// pages/admin/post/postDetail/postDetail.js
const Api = require('../../../../utils/api');
const App = getApp();
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
  getInputTitle: function (e) {
    this.setData({
      title: e.detail
    });
  },
  getInputContent: function (e) {
    var content = e.detail.value;
    var summary ;
    if(content.length>140){
      summary = content.slice(0,139);
    }else{
      summary = content ;
    }

    this.setData({
      content: content,
      zhaiyaoValue:summary
    });
    // console.log(this.data.content)
  },
  getInputSlug: function (e) {
    this.setData({
      slug: e.detail.value
    });
  },
  getInputThumb: function (e) {
    this.setData({
      thumb: e.detail.value
    });
  },
  getInputZhaiyao: function (e) {
    this.setData({
      zhaiyaoValue: e.detail.value
    });
  },
  onCommentChange: function (e) {
    console.log(e);
    this.setData({
      commentChecked: e.detail
    })
  },
  onTopChange: function (e) {
    console.log(e);
    this.setData({
      topChecked: e.detail
    })
  },
  onCategoryChange: function (e) {

    this.setData({
      categoryIds: e.detail
    })
  },
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
  sureBtn: function () {
    this.setData({
      showPopup: true
    })
  },
  /**
   * 保存到草稿箱
   */
  save:function(){
    var index = this.data.index;
    if(index == 0){
      //新建文章
      this.createPost('DRAFT');
    }else{
      //更新文章
      this.upDatePost('DRAFT');
    }
  },
  /**
   * 发布
   */
  publish:function(){
    var index = this.data.index;
    if(index == 0){
      //新建文章
      this.createPost('PUBLISHED');
    }else{
      //更新文章
      this.upDatePost('PUBLISHED');
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
      data.categoryIds = this.formatConversion(this.data.categoryIds,'Number');//分类
      data.createTime = new Date().getTime();//创建时间
      data.disallowComment = !this.data.commentChecked;//是否打开评论
      data.editorType = this.data.editorType ;//编辑类型
      data.originalContent = content;//文章内容
      data.slug = this.data.slug ;//文章别名
      data.status = status;//文章状态，动态传入
      data.summary = this.data.zhaiyaoValue;//文章摘要
      data.tagIds = this.formatConversion(this.data.tagIds,'Number');//标签
      data.title = title; //标题
      data.thumbnail = this.data.thumb;//封面图
      data.topped = this.data.topChecked;//是否置顶
      data.topPriority = 0;
      // data.editTime = new Date().getTime();
      // console.log(data);
      Api.requestPostJSONApi('/api/admin/posts/?autoSave=false', data, this, this.createPostSuccess);
    } else {
      App.showToast("标题或内容不能为空")
    }

  },
  createPostSuccess:function(res,obj){
    App.showSinglModalFun("操作成功",{
      success(){
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
      data.categoryIds = this.formatConversion(this.data.categoryIds,'Number');//分类
      // data.createTime = this.data.createTime;//创建时间
      data.disallowComment = !this.data.commentChecked;//是否打开评论
      data.editorType = this.data.editorType ;//编辑类型
      data.originalContent = content;//文章内容
      data.slug = this.data.slug ;//文章别名
      data.status = status;//文章状态，动态传入
      data.summary = this.data.zhaiyaoValue;//文章摘要
      data.tagIds = this.formatConversion(this.data.tagIds,'Number');//标签
      data.title = title; //标题
      data.thumbnail = this.data.thumb;//封面图
      data.topped = this.data.topChecked;//是否置顶
      data.topPriority = 0;
      data.editTime = new Date().getTime();
      // console.log(data);
      Api.requestPutJSONApi('/api/admin/posts/' + postId, data, this, this.updatePostSuccess);
    } else {
      App.showToast("标题或内容不能为空")
    }

  },
  updatePostSuccess:function(res,obj){
     App.showSinglModalFun("操作成功",{
       success(){
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
  getPostDetailSuccess: function (res, obj) {
    // var object = res.data.content;
    obj.setData({
      title: res.data.title,
      content: res.data.originalContent,
      thumb:res.data.thumbnail,
      slug:res.data.slug,
      categoryIds:obj.formatConversion(res.data.categoryIds,'String'),
      tagIds:obj.formatConversion(res.data.tagIds,'String'),
      zhaiyaoValue:res.data.summary,
      commentChecked:!res.data.disallowComment,
      topChecked:res.data.topped,
      createTime:res.data.createTime    
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
  formatConversion:function(array,needType){
    if(needType == 'String'){
      for(var i = 0;i<array.length;i++){
        array[i] = String(array[i])
      }
    }else{
      for(var i = 0;i<array.length;i++){
        array[i] = Number(array[i])
      }
    }
    return array;
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