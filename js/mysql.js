const mysql = require('mysql2')
const {sql} = require('./config')
let connection = null;

//连接数据库
function linkedDB() {
    connection = mysql.createConnection({
        host: sql.host,
        user: sql.user,
        password: sql.password,
        database: sql.database,
    })
    console.log("数据库连接成功");
}

//数据库的查询
function selecter(str, callBack){
    connection.query(str, function(err, results, fields){
        // console.log("select success");
        callBack(results);
    })
}

//数据库的其它操作
function set(str, callBack) {
    connection.execute(
        str, function(err, results, fields){
            // console.log("update mysql is success");
            callBack("success");
        }
    )
}

//promise数据库的查询
function pselecter(str, arr=[]){
    return new Promise((resolve, reject) => {
        connection.query(str, arr , function(err, results, fields){
            resolve(results);
        })
    })
}

//promise数据库其它操作
function pset(str, arr=[]){
    return new Promise((resolve, reject) => {
        connection.execute(
            str, function(err, results, fields){
                resolve(results);
            }
        )
    })
}


module.exports = {
    pset,
    pselecter,
    linkedDB,
    selecter,
    set
}