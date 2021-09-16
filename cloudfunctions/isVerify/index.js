// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return setting =  await db.collection('setting').where({_id:'cd045e756139d8e00c6f0fcc1fc4a3f1'}).get();
}