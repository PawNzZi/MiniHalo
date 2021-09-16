// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  await cloud.openapi.subscribeMessage.send({
    "touser": event.openid,
    "page": 'pages/article/article?scene='+event.postId,
    "lang": 'zh_CN',
    "data": {
      "thing5": {
        "value": event.title
      },
      "thing2": {
        "value": event.content
      },
      "thing3": {
        "value": event.username
      }
    },
    "templateId": event.subId,
    "miniprogramState": 'formal'
  })
  
}