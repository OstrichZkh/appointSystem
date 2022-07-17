var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var expressJwt = require("express-jwt");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var appRouter = require('./routes/app');

var app = express();
// 改写
var http = require('http')
var server = http.createServer(app);
// jwt中间件
app.use(expressJwt({
    credentialsRequired: false,//关键
    algorithms:['HS256'],
    secret: "yousecret"//加密密钥，可换
}).unless({
    path: ["/login","/register"]//添加不需要token验证的路由 
}));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
// 静态资源托管
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/app', appRouter);



// module.exports = app;
server.listen('3002',()=>{
  console.log('3002');
})
