const { DATE } = require('mysql/lib/protocol/constants/types')
const dbConfig = require('../util/dbconfig')
const jwt = require('jsonwebtoken')
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

const codeSent = new Map()//已发送的验证码
// 生成随机数
function rand(min,max){
  return Math.floor(Math.random()*(max-min))+min
}

// 模拟发送验证码
async function sendCodeFake(req,res){
  let phone = req.query.phone
  let code = rand(1000,9999)
  if(codeSent.has(phone)){
    res.send({
      'code':400,
      'msg':'已经发送过验证码！'
    })
  }else{
    console.log(req.query)
    codeSent.set(phone,code)
    setTimeout(()=>{
      codeSent.delete(phone)
    },60000)
    res.send({
      'code':200,
      'msg':'验证码发送成功'
    })
  }
  console.log('code',code)
}

async function sendCodeAli(req,res){
  let phone = req.body.phone
  let code = rand(1000,9999)
  let params = {
    "SignName": "阿里云短信测试",
    "TemplateCode": "SMS_154950909",
    "PhoneNumbers": phone,
    "TemplateParam": JSON.stringify({"code":code})
  }
  let requestOption = {
    method: 'POST'
  };
  client.request('SendSms', params, requestOption).then((result)=>{
    if(result.Code == 'OK'){
      res.send({
        'code':200,
        'msg':'发送成功'
      })
      codeSent.set(phone,code)
      console.log('AliCode',code)
    }else{
      res.send({
        'code':400,
        'msg':'发送失败'
      })
    }
  })

}

// 注册事件
async function Register(req,res){
  let {name,phone,code,password,gender,type,mail} = req.body
  let sql = `select * from user where phone=?`
  let sqlArr = [phone]
  let result = await dbConfig.AsyncSqlConnect(sql,sqlArr)
  if(result.length!==0){
    res.send({
      'code':400,
      'msg':'账号已经注册！',
      'data':result[0]
    })
  }else{
    if(codeSent.get(phone)!=code){
      res.send({
        'code':400,
        'msg':'验证码错误'
      })
    }else{
      let sql = `insert into user(name,phone,password,gender,mail,type,create_time) values(?,?,?,?,?,?,?)`
      let sqlArr = [name,phone,password,gender,mail,type,+(new Date())]
      let result = dbConfig.AsyncSqlConnect(sql,sqlArr)
      res.send({
        'code':200,
        'msg':'账号注册成功',
        'data':result[0]
      })
    }
  }
  
}

// 修改信息
async function Revinfo(req,res){
    let {name,phone,code,password,gender,type,mail} = req.body
    if(codeSent.get(phone)!=code){
    console.log(codeSent,code,phone);
      res.send({
        'code':400,
        'msg':'验证码错误'
      })
    }else{
      console.log(req.body);
      let sql = `delete from user where phone=?`
      let sqlArr = [phone]
      await dbConfig.AsyncSqlConnect(sql,sqlArr)
      sql = `insert into user(name,phone,password,gender,mail,type,create_time) values(?,?,?,?,?,?,?)`
      sqlArr = [name,phone,password,gender,mail,type,+(new Date())]
      let result = await dbConfig.AsyncSqlConnect(sql,sqlArr)
      res.send({
        'code':200,
        'msg':'账号信息修改成功',
        'data':result[0]
      })
    }
}
// 验证身份
async function Validate(req,res){
  // 获取用户名和密码
  let {account,password} = req.body
  let sql = `select * from user where phone=? and password = ? or mail=? and password=?`
  let sqlArr = [account,password,account,password]
  let result = await dbConfig.AsyncSqlConnect(sql,sqlArr)
  if(result.length!==0){
      // 登录成功，生成jwt
      // 注意默认情况 Token 必须以 Bearer+空格 开头
    const token = 'Bearer ' + jwt.sign(
      {
        phone: result[0].phone,
        type: result[0].type,
      },
      'zhukaihangSys',
      {
        expiresIn: 3600 * 24 * 3
      }
    )
    console.log(token);

    res.send({
      'code':200,
      'msg':'登录成功',
      'data':result[0],
      'token':token
    })
  }else{
    res.send({
      'code':400,
      'msg':'登录失败'
    })
  }
}

// 获取信息
async function Getinfo(req,res){
  // 获取用户名和密码
  let {phone} = req.query
  let sql = `select * from user where phone=?`
  let sqlArr = [phone]
  let result = await dbConfig.AsyncSqlConnect(sql,sqlArr)
  res.send({
    'code':200,
    'msg':'用户信息请求成功',
    'data':result[0]
  })
}



module.exports = {
  sendCodeFake,
  sendCodeAli,
  Register,
  Validate,
  Getinfo,
  Revinfo
}