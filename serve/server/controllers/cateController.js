var dbConfig = require('../util/dbconfig')


//获取分类
getCate = (req,res)=>{
    // res.render('index', { title: 'Express' });
    let sql = 'select * from student'
    let sqlArr = []
    let callback = function(err,data){
      if(err){
        console.log('err');
      }else{
        res.send({
          'list':data
        })
      }
    }
  dbConfig.sqlConnect(sql,sqlArr,callback)
    
}
// 获取指定分类的文章列表
getPost = (req,res)=>{
  let {id} = req.query
  let sql = `select * from post where cate_id=?`
  let sqlArr = [id]
  let callback = function(err,data){
    if(err){
      console.log('err');
    }else{
      console.log('sucess')
      res.send({
        'list':data
      })
    }
  }
  dbConfig.sqlConnect(sql,sqlArr,callback)

  
}

module.exports = {
  getCate,
  getPost
}

