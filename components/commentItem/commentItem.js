// components/commentItem/commentItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList:{
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
    passComment:function(e){
      var item = e.currentTarget.dataset.item;
      this.triggerEvent("passComment", {
        item
      })
    },
    replyComment:function(e){
      var item = e.currentTarget.dataset.item;
      this.triggerEvent("replyComment", {
        item
      })
    },
    deleteComment:function(e){
      var item = e.currentTarget.dataset.item;
      this.triggerEvent("deleteComment", {
        item
      })
    }
  }
})
