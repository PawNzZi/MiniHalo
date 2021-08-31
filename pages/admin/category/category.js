// pages/admin/category/category.js
const Api = require('../../../utils/api');
const App = getApp();
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    showShare: false,
    options: [{
        name: '新增分类',
        icon: 'http://cdn.lingyikz.cn/add.png',
      },
      {
        name: '更新分类',
        icon: 'http://cdn.lingyikz.cn/update.png',
      },
      {
        name: '删除分类',
        icon: 'http://cdn.lingyikz.cn/delete.png',
      },
    ],
  },
  clickItem:function(e){
    this.setData({showShare:true,item:e.detail.item})
    // console.log(e.detail.item);
  },
  onClose:function(){
    this.setData({showShare:false});
  },
  onSelect:function(e){
    console.log(e);
    var _this = this ;
    var index = e.detail.index;
    var item = this.data.item;
    var categoryId = item.id
    if(index == 0 || index == 1){
      _this.setData({showShare:false})
       wx.navigateTo({
         url: '/pages/admin/category/categoryDetail/categoryDetail?index='+index+'&categoryId='+categoryId,
       })
    }else{
      App.showModal('确定删除 '+item.name+' 分类？',{
        success(){
          // console.log("删除tag")
          var data = {};
          Api.requestDeleteApi('/api/admin/categories/'+categoryId,data,_this,_this.deleteCategorySuccess);
        }
      })
    }
  },
  deleteCategorySuccess:function(res,obj){
    obj.setData({showShare:false})
    App.showSinglModalFun('删除成功',{
      success(){
        var data = {};
        data.sort = 'createTime,desc';
        data.more = true;
        Api.requestGetApi('/api/admin/categories', data, obj, obj.categorySuccess);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
  categorySuccess:function(res,obj){
    var array = res.data;
    for(var i = 0;i<array.length;i++){
      array[i].color = App.radomColor();
    }
    obj.setData({colorList:array})
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
    var data = {};
    data.sort = 'createTime,desc';
    data.more = true;
    Api.requestGetApi('/api/admin/categories',data,this,this.categorySuccess);
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