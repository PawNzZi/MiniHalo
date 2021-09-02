// components/colorCard/colorCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    colorList:{
      type:Array
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
    clickItem:function(e){
      var item = e.currentTarget.dataset.item;
      this.triggerEvent('click',{item});
    }
  }
})
