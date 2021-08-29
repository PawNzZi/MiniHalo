// components/itemCard/itemCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     array:{
       type:Array
     },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchItem:function(e){
      var postId = e.currentTarget.dataset.postid;
      console.log("post:"+postId)
      wx.navigateTo({
        url: '/pages/article/article?postId='+postId,
      })
    }
  }
})
