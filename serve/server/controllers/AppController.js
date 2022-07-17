const dbConfig = require('../util/dbconfig')


// 登记预约信息
function makeappoint(req,res){
  let data = req.body
  let sql = `insert into appoint(name,type,date,time1,time2) value(?,?,?,?,?)`
  let sqlArr = [data.name,data.type,data.date,data.time1,data.time2]
  dbConfig.AsyncSqlConnect(sql,sqlArr)
  console.log(data);
  res.send({
    'code':200,
    'msg':'预约成功'
  })
}

// 获取所有预约信息
async function getapplist(req,res){
  let sql = `select * from appoint`
  let sqlArr = []
  let data = await dbConfig.AsyncSqlConnect(sql,sqlArr)
  res.send({
    'code':200,
    'msg':'获取信息成功',
    'data':data
  })
}


module.exports = {
  makeappoint,
  getapplist
}