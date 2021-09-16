// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  var user = {'openid':wxContext.OPENID};
  const count = await db.collection('user').where({openid:wxContext.OPENID}).get();
  // console.log(JSON.stringify(count))
  if(count.data.length == 0){
    // console.log("没有该用户")
    var userInfo = event.userInfo;
    userInfo.openid = wxContext.OPENID;
    const add = await db.collection('user').add({data:userInfo});
    user._id = add[_id]
    return user ;
  }else{
    // console.log("有该用户")
    user._id = count.data[0]._id;
    return user ;
  }


}