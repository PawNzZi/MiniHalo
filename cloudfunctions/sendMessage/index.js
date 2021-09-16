// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  /**
   * 先查询到已经订阅了消息的用户
   * 循环向这些用户发送订阅消息 
   */
  const user =  await db.collection('user').where({subId:event.subId}).get();
  var list = user.data;
  if(list.length > 0){
    for(var i = 0;i<list.length;i++){
      await cloud.openapi.subscribeMessage.send({
        "touser": list[i].openid,
        "page": 'pages/article/article?scene='+event.postId,
        "lang": 'zh_CN',
        "data": {
          "thing9": {
            "value": event.title
          },
          "thing6": {
            "value": event.summary
          },
          "thing7": {
            "value": event.tip
          }
        },
        "templateId": event.subId,
        "miniprogramState": 'formal'
      })
    }
  }
  return {success:'ok'}
}