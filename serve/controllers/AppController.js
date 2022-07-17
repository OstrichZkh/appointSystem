const dbConfig = require('../util/dbconfig')


// 登记预约信息
function makeappoint(req,res){
  let data = req.body
  let sql = `insert into appoint(name1,name2,type,date,time1,time2) value(?,?,?,?,?,?)`
  let sqlArr = [data.name1,data.name2,data.type,data.date,data.time1,data.time2]
  dbConfig.AsyncSqlConnect(sql,sqlArr)
  res.send({
    'code':200,
    'msg':'预约成功'
  })
}

// 获取所有预约信息
async function getapplist(req,res){
  let auth = req.query.auth
  let name = req.query.name
  let sql
  let sqlArr
  if(auth=='老师'){
    sql = `select * from appoint where name2=?`
    sqlArr = [name]
  }else if(auth=='学生'){
    sql = `select * from appoint where name1=?`
    sqlArr = [name]
  }else{
    sql = `select * from appoint`
    sqlArr = []
  }
  let data = await dbConfig.AsyncSqlConnect(sql,sqlArr)
  res.send({
    'code':200,
    'msg':'获取信息成功',
    'data':data
  })
}

// 获取教师列表
async function Getteacher(req,res){
  let sql = `select * from user where type=?`
  let sqlArr = ['老师']
  let result = await dbConfig.AsyncSqlConnect(sql,sqlArr)
  let nameList = []
  for(let item of result){
    nameList.push(item.name)
  }
  res.send({
    'code':200,
    'msg':'用户信息请求成功',
    'data':nameList
  })
}

module.exports = {
  makeappoint,
  getapplist,
  Getteacher
}