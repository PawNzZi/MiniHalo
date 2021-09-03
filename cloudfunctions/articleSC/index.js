// 云函数入口文件
const cloud = require('wx-server-sdk')
const rq = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  return await rq({
    method:'POST',
    url:'https://www.coder.work/textcensoring/getresult',
    headers:{'Content-Type':'application/json'},
    body:event.body,
    json:true
  }).then(res=>{
    return res.result
  }).catch(err=>{
    return err
  })
}