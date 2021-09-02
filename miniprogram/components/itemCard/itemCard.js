// components/itemCard/itemCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     array:{
       type:Array
     },
     admin:{
       type:Boolean,
       value:false
     }
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
      var item = e.currentTarget.dataset.item;
      if(this.properties.admin){
        this.triggerEvent('touchItem',{item});
      }else{
        // console.log(item)
        wx.navigateTo({
          url: '/pages/article/article?postId='+item.id,
        })
      }
      
     
    }
  }
})
