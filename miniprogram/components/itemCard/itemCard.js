// components/itemCard/itemCard.js
const App = getApp();
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
     },
     backgroundColor:{
       type:String,
       value:''
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
        // console.log('touchItem:'+App.globalData._ID);
        if(App.globalData._ID && !App.globalData.IS_SUBMESSAGE){
          App.acceptSubMessage({
            success(){
              wx.navigateTo({
                url: '/pages/article/article?postId='+item.id,
              })
            },
            fail(){
              wx.navigateTo({
                url: '/pages/article/article?postId='+item.id,
              })
            }
          });
        }else{
          //没有用户id，说明该用户尚未登陆，直接进入文章详情
          wx.navigateTo({
            url: '/pages/article/article?postId='+item.id,
          })
        }
    
      }
     
    }
  }
})
