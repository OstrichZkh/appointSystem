var dbConfig = require('../util/dbconfig')
// 调用阿里大鱼
const Core = require('@alicloud/pop-core')
const config = require('../util/aliconfig')

let client = new Core({
  'accessKeyId': '***',
  'accessKeySecret': '***',
  // securityToken: '<your-sts-token>', // use STS Token
  'endpoint': 'https://dysmsapi.aliyuncs.com',
  'apiVersion': '2017-05-25'
})
let requestOption = {
  method: 'POST'
};

function rand(min,max){
  return Math.floor(Math.random()*(max-min))+min
}
// 验证是否已经发送
const validatePhoneCode = []
function sendCodeP(phone){
  for(let item of validatePhoneCode){
    if(phone==item.phone){
      return true
    }
  }
  return false
}
//匹配验证码
function findCodeAndPhone(phone,code){
  for(let item of validatePhoneCode){
    if(phone==item.phone&&code==item.code){
      return 'login'
    }
  }
  return 'error'

}
// 检验验证码是否第一次登录
async function phoneLoginBind(phone){
  let sql = 'select * from user where username=? or phone=?'
  let sqlArr = [phone,phone]
  let res = await dbConfig.AsyncSqlConnect(sql,sqlArr)
  if(res.length){
    // 第二次登录
    res[0].userinfo = await getUserInfo(res[0].id)
    return res
  }else{
    // 第一次登录 -> 用户注册
    let res = await regUsers(phone)
    
    // 获取信息详情
    res[0].userinfo = await getUserInfo(res[0].id)
    return res
   }
}

// 用户注册的方法
async function regUsers(phone){
  let userpic = 'https://i1.hdslb.com/bfs/face/b83623525f9f2ef99e1f7350fbd268e433716b7a.jpg@96w_96h_1c_1s.webp'
  let sql = `insert into user(username,userpic,phone,create_time) value(?,?,?,?)`
  let sqlArr = [phone,userpic,phone,+(new Date())]
  let res = await dbConfig.AsyncSqlConnect(sql,sqlArr)
  console.log('res',res);
  if(res.affectedRows == 1){
    console.log('第一次插入，创建用户副表');
    // 执行成功，获取用户信息
    let user = await getUser(phone)
    // 创建用户副表
    let userInfo = await createUserInfo(user[0].id)
    if(userInfo.affectedRows ==1 ){
      return user
    }else{
      return false
    }
  }else{

  }
}

// 获取用户信息
function getUser(username){
  let sql = `select * from user where id=? or phone=? or username=?`
  let sqlArr = [username,username,username]
  return dbConfig.AsyncSqlConnect(sql,sqlArr)
}

// 创建用户副表
function createUserInfo(user_id){
  console.log('创建了用户副表');
  let sql = `insert into userinfo(user_id,age,sex,job) values(?,?,?,?)`
  let sqlArr = [user_id,18,0,'无业游民']
  return dbConfig.AsyncSqlConnect(sql,sqlArr)
}

// 获取用户副表信息
function getUserInfo(user_id){
  let sql = `select age,sex,job,path,birthday from userinfo where user_id=?`
  let sqlArr = [user_id]
  return dbConfig.AsyncSqlConnect(sql,sqlArr)
}

// 阿里云发送验证码
let sendCoreCode = (req,res)=>{
  let phone = req.body.phone
  let code = rand(1000,9999)
  let params = {
    "SignName": "阿里云短信测试",
    "TemplateCode": "SMS_154950909",
    "PhoneNumbers": "18811727792",
    "TemplateParam": JSON.stringify({"code":code})
  }
  let requestOption = {
    method: 'POST'
  };
  client.request('SendSms', params, requestOption).then((result)=>{
    console.log(result);
    if(result.Code == 'OK'){
      res.send({
        'code':200,
        'msg':'发送成功'
      })
      validatePhoneCode.push({
        'phone':phone,
        'code':code
      })
      console.log('AliCode',code)
    }else{
      res.send({
        'code':400,
        'msg':'发送失败'
      })
    }
  })
}

// 模拟验证码发送接口
let sendCode = (req,res)=>{
  let phone = req.body.phone
  // console.log(phone,req.body.phone);
  if(sendCodeP(phone)){
    res.send({
      'code':400,
      'msg':'已经发送过验证码了'
    })
  }else{
    let code = rand(1000,9999)
  validatePhoneCode.push({
    'phone':phone,
    'code':code
  })
  res.send({
    'code':200,
    'msg':'发送成功'
  })
  console.log('code',code)
  }

  
}

//验证码登录接口
let validateCode = async (req,res)=>{
  let {phone,code} = req.body
  // 是否发送过验证码
  if(sendCodeP(phone)){
  // 是否匹配
    let status = findCodeAndPhone(phone,code)
    if(status=='login'){
      //登录成功 
      let user = await phoneLoginBind(phone)
      res.send({
        'code':200,
        'msg':'登录成功',
        'data':user[0]
      })
    }else{
      //登录失败
      res.send({
        'code':400,
        'msg':'登录失败，验证码不匹配'
      })
    }

  }else{
    res.send({
      'code':400,
      'msg':'未发送验证码'
    })
  }
}

// 用户名、手机号登录
function login(req,res){
  let username = req.body.username
  let password = req.body.password
  let phone = /^1[3456789]\d{9}$/
  let email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if(phone.test(username)){
    let sql = 'select * from user where phone=? and password=? or username=? and password=?'
    let sqlArr = [username,password,username,password]
    let callBack = async (err,data)=>{
      if(err){
        res.send({
          'code':400,
          'msg':'err'
        })
      }else if(data==''){
        res.send({
          'code':400,
          'msg':'用户名或密码有误'
        })
      }else{
        let user_id = data[0].id
        let result = await getUserInfo(user_id)
        data[0].userinfo = result[0]
        res.send({
          'code':200,
          'msg':'登录成功',
          'data':data[0]
        })
      }
    }
    dbConfig.sqlConnect(sql,sqlArr,callBack)
  }else if(email.test(username)){
    let sql = 'select * from user where email=? and password=?'
    let sqlArr = [username,password] 
    let callBack = async (err,data)=>{
      if(err){
        res.send({
          'code':400,
          'msg':'err'
        })
      }else if(data==''){
        res.send({
          'code':400,
          'msg':'邮箱或密码有误'
        })
      }else{
        let user_id = data[0].id
        let result = await getUserInfo(user_id)
        data[0].userinfo = result[0]
        res.send({
          'code':200,
          'msg':'登录成功',
          'data':data[0]
        })
      }
    }
  dbConfig.sqlConnect(sql,sqlArr,callBack)

  }else{
    let sql = `select * from user where username=? and password=?`
    let sqlArr = [username,password]
    let callBack = async (err,data)=>{
      if(err){
        res.send({
          'code':400,
          'msg':'err'
        })
      }else if(data==''){
        res.send({
          'code':400,
          'msg':'邮箱或密码有误'
        })
      }else{
        let user_id = data[0].id
        let result = await getUserInfo(user_id)
        data[0].userinfo = result[0]
        res.send({
          'code':200,
          'msg':'登录成功',
          'data':data[0]
        })
      }
    }
  dbConfig.sqlConnect(sql,sqlArr,callBack)
  }
}


module.exports = {
  sendCode,
  validateCode,
  sendCoreCode,
  login
}