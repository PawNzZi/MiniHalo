// pages/admin/tag/tagDetail/tagDetail.js
const Api = require('../../../../utils/api')
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn_text:'',
    name:'',
    slug:'',
  },
  getInputName:function(e){
    this.setData({name:e.detail});
  },
  getInputSlug:function(e){
    this.setData({slug:e.detail});
  },
  /**
   * 新增标签或修改标签提交Api
   */
  commitApi:function(){
    var name = this.data.name;
    var slug = this.data.slug;
    if(App.checkTextIsEmpty(name) && App.checkTextIsEmpty(slug)){
      var index = this.data.index;
      var tagId = this.data.tagId;
      var data = {};
      data.name = name;
      data.slug = slug;
      if(index == 0){
        Api.requestPostJSONApi('/api/admin/tags',data,this,this.tagSuccess);
      }else{
        Api.requestPutJSONApi('/api/admin/tags/'+tagId,data,this,this.tagSuccess);
      }
    }else{
      App.showToast("名称或别名不能为空")
    }
    
  },
  /**
   * 新增或修改成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  tagSuccess:function(res,obj){
    App.showSinglModalFun('操作成功！',{
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
    var index = options.index;
    if(index == 0){
      wx.setNavigationBarTitle({
        title: '新建Tag',
      })
      this.setData({btn_text:'保存',index:index})
    }else{
      wx.setNavigationBarTitle({
        title: '修改Tag',
      })
      var tagId = options.tagId;
      this.setData({btn_text:'更新',tagId:tagId,index:index})
      var data = {};
      Api.requestGetApi('/api/admin/tags/'+tagId,data,this,this.getTagDetailSuccess);
    }
  },
  getTagDetailSuccess:function(res,obj){
     obj.setData({name:res.data.name,slug:res.data.slug})
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