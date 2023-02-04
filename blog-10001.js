const express = require('express');
const app = express();

// uuid
const uuid = require('uuid')
// console.log(uuid.v4())

// 连接数据库
const mysql = require('./js/mysql')
mysql.linkedDB()

// 启用文件接收
const multer = require('multer');
app.use(multer().any());

// 配置html文件夹为静态文件夹
app.use(express.static('index'));

// 接收post请求
app.use(express.json())

//为所有源启用跨域
const cors = require('cors');
app.use(cors());

// 认证中间件
// const center = require('./js/middleware/validation.js')
// app.use('/api', center)

// 使用认证中间件进行认证
// 实训测试接口
// const shixvnMain = require('./js/main/shixvnMain')
// app.use('/api/shixvn', shixvnMain);

// upload 上传文件入口
const multerUpload = require('./js/main/upload');
app.use('/upload', multerUpload);

// boss端 API入口
const bossSet = require('./js/main/boss');
app.use('/boss', bossSet);

// 用户Web端 API入口
const userWebSet = require('./js/main/userWeb');
app.use('/userWeb', userWebSet);

// 启动服务
// 证书及端口
/*
const http = require('http')
const https = require('https')
const fs = require('fs')
const httpsOption = {
    key : fs.readFileSync("./https/linfeng.vip.key"),
    cert: fs.readFileSync("./https/linfeng.vip.pem")
}
http.createServer(app).listen(80, () => console.log('服务器启动成功'));
https.createServer(httpsOption, app).listen(443, () => console.log('https证书正常'));
*/

app.listen('10001', () => console.log('服务器启动成功'))
