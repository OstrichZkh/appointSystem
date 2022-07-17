const mysql = require('mysql')
module.exports = {
  config:{
    host:'localhost',
    port:'3306',
    user:'root',
    password:'admin123',
    database:'managementapp',

  },
  // 连接数据库
  sqlConnect:function(sql,sqlArr,callBack){
    let pool = mysql.createPool(this.config)
    pool.getConnection((err,connect)=>{
      console.log('connect');
      if(err){
        console.log('连接失败');
        return
      }
      //事件驱动回调
      connect.query(sql,sqlArr,callBack)
      //释放连接
      connect.release()
    })
  },

  // promise回调
  AsyncSqlConnect:function(sql,sqlArr){
    return new Promise((resolve,reject)=>{
    let pool = mysql.createPool(this.config)
    pool.getConnection((err,connect)=>{
      if(err){
        console.log('连接失败');
        reject(err)
      }else{
        //事件驱动回调
        connect.query(sql,sqlArr,(err,data)=>{
          if(err){
            // console.log('请求错误');
            reject(err)
          }else{
            // console.log('请求成功');
            resolve(data)
          }
        })
        //释放连接
        connect.release()
      }

    })
    }).catch((err)=>{
      console.log(err);
    })
  }
}