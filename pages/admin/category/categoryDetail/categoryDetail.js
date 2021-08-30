// pages/admin/category/categoryDetail/categoryDetail.js
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
  getInputPassword:function(e){
    this.setData({password:e.detail});
  },
  getInputDescription:function(e){
    this.setData({description:e.detail});
  },
    /**
   * 新增标签或修改标签提交Api
   */
  commitApi:function(){
    var name = this.data.name;
    var slug = this.data.slug;
    
    if(App.checkTextIsEmpty(name) && App.checkTextIsEmpty(slug)){
      var index = this.data.index;
      var categoryId = this.data.categoryId;
      var data = {};
      data.name = name;
      data.slug = slug;
      data.password = this.data.password;
      data.description = this.data.description;
      if(index == 0){
        Api.requestPostJSONApi('/api/admin/categories',data,this,this.categorySuccess);
      }else{
        Api.requestPutJSONApi('/api/admin/categories/'+categoryId,data,this,this.categorySuccess);
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
  categorySuccess:function(res,obj){
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
        title: '新建Category',
      })
      this.setData({btn_text:'保存',index:index})
    }else{
      wx.setNavigationBarTitle({
        title: '修改Category',
      })
      var categoryId = options.categoryId;
      this.setData({btn_text:'更新',categoryId:categoryId,index:index})
      var data = {};
      Api.requestGetApi('/api/admin/categories/'+categoryId,data,this,this.getCategoryDetailSuccess);
    }
  },
  getCategoryDetailSuccess:function(res,obj){
    obj.setData({name:res.data.name,slug:res.data.slug,password:res.data.password,description:res.data.description})
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