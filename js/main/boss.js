const lf = require('../tools')
const express = require('express');
const router = express.Router();
const uuid = require('uuid')
const mysql = require('./../mysql')


// 循环定时器
setInterval(() => {
    bossLoopToken()
}, 1000 * 60 * 60 * 2);

// 循环执行更换token
function bossLoopToken() {
    const tmpToken = uuid.v4()
    mysql.set(`update boss_login set token='${tmpToken}' where id = 1;`, tmp => {
        console.log('token更换成功')
    })
}

/**
 * 写入日志
 * @param {String} classInfo 日志分类
 * @param {String} info 日志信息
 */
function bossInsertLog(classInfo, info) {
    mysql.set(`insert into boss_log(classInfo, timeStrInfo, info) values('${classInfo}', '${lf.date.format()}', '${info}')`, tmp => { })
}

/**
 * boss登录api
 * req传入user和pwd后才能登录
 */
router.post('/login', (req, res) => {
    const { user, pwd } = req.body
    console.log(user + '&' + pwd);
    if (user != '' && user != null && user != undefined && pwd != '' && pwd != null && pwd != undefined) {
        mysql.selecter('select * from boss_login', tmp => {
            const info = tmp[0]
            // console.log(info);
            if (user === info.user && pwd === info.password) {
                bossInsertLog('登录认证', `登录成功`)
                // 登录成功
                res.send({
                    state: 'success',
                    time: new Date(),
                    token: info.token,
                    info: '登录成功'
                })
            } else {
                bossInsertLog('登录认证', `登录失败`)
                // 用户名或密码有误
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '用户名或密码错误'
                })
            }
        })
    } else {
        // 用户名或密码为空
        res.send({
            state: 'fail',
            time: new Date(),
            info: '用户名或密码不可为空'
        })
    }
})

/**
 * 判断token
 * 传入token
 */
router.post('/token', (req, res) => {
    const { token } = req.body
    mysql.selecter('select * from boss_login', tmpToken => {
        const selectToken = tmpToken[0].token
        if (token === selectToken) {
            res.send({
                state: 'success',
                time: new Date(),
                info: '您的token正确'
            })
        } else {
            res.send({
                state: 'fail',
                time: new Date(),
                info: '您的token有误'
            })
        }
    })
})

/**
 * 发布文章
 * 传入title、info和text
 * @param {String} title 文章标题
 * @param {String} info 文章信息
 * @param {String} text 文章内容
 */
router.post('/insertArticle', (req, res) => {
    const { token, title, info, text } = req.body
    if (token != undefined && title != '' && title != null && title != undefined && info != '' && info != null && info != undefined && text != '' && text != null && text != undefined) {
        mysql.selecter('select * from boss_login', tmpToken => {
            const selectToken = tmpToken[0].token
            if (token === selectToken) {
                const createTime = lf.date.format()
                const createDate = lf.date.format('YYYY-MM-DD')
                const id = uuid.v4()
                mysql.set(`insert into blog_main(id,createTime,createDate,title,info,text,showNum) values('${id}', '${createTime}', '${createDate}', '${title}', '${info}', '${text}', 0)`, tmp => {
                    // console.log(text);
                    bossInsertLog('文章操作', `发布文章${title}成功`)
                    res.send({
                        state: 'success',
                        time: new Date(),
                        info: '发布文章成功',
                    })
                })
            } else {
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '您的token有误'
                })
            }
        })
    } else {
        bossInsertLog('文章操作', `发布文章失败`)
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    }

})


/**
 * 删除文章
 * 传入id
 */
router.post('/deleteArticle', (req, res) => {
    const { token, id } = req.body
    if (token != undefined, id != '' && id != null && id != undefined) {
        mysql.selecter(`select * from blog_main where id = '${id}'`, tmp => {
            if (tmp.length > 0) {
                mysql.selecter('select * from boss_login', tmpToken => {
                    const selectToken = tmpToken[0].token
                    if (token === selectToken) {
                        mysql.set(`delete from blog_main where id = '${id}'`, tmp2 => {
                            bossInsertLog('文章操作', `删除文章${tmp[0].title}成功`)
                            res.send({
                                state: 'success',
                                time: new Date(),
                                info: '删除文章成功',
                            })
                        })
                    } else {
                        res.send({
                            state: 'fail',
                            time: new Date(),
                            info: '您的token有误'
                        })
                    }
                })
            } else {
                bossInsertLog('文章操作', `该文章不存在`)
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '文章不存在'
                })
            }
        })
    } else {
        bossInsertLog('文章操作', `删除文章失败，空参数`)
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    }
})


/**
 * 添加日记
 * 传入text
 */
router.post('/insertDiary', (req, res) => {
    const { token, text } = req.body
    if (token != undefined, text != '' && text != null && text != undefined) {
        mysql.selecter('select * from boss_login', tmpToken => {
            const selectToken = tmpToken[0].token
            if (token === selectToken) {
                const createTime = lf.date.format('YYYY-MM-DD hh:mm:ss')
                const id = uuid.v4()
                mysql.set(`insert into blog_diary(id,createTime,text,createTextTime) values('${id}','${createTime}','${text}','${createTime}')`, tmp => {
                    bossInsertLog('日记操作', `添加日记${createTime}成功`)
                    res.send({
                        state: 'success',
                        time: new Date(),
                        info: '添加日记成功',
                    })
                })
            } else {
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '您的token有误'
                })
            }
        })
    } else {
        bossInsertLog('日记操作', `添加日记失败`)
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    }
})


/**
 * 删除日记
 * 传入id
 */
router.post('/deleteDiary', (req, res) => {
    const { token, id } = req.body
    if (token != undefined && id != '' && id != null && id != undefined) {
        mysql.selecter('select * from boss_login', tmpToken => {
            const selectToken = tmpToken[0].token
            if (token === selectToken) {
                mysql.selecter(`select * from blog_diary where id = '${id}'`, tmp => {
                    if (tmp.length > 0) {
                        mysql.set(`delete from blog_diary where id = '${id}'`, tmp2 => {
                            bossInsertLog('日记操作', `删除日记${tmp[0].createTextTime}成功`)
                            res.send({
                                state: 'success',
                                time: new Date(),
                                info: '删除日记成功',
                            })
                        })
                    } else {
                        bossInsertLog('日记操作', `该日记不存在`)
                        res.send({
                            state: 'fail',
                            time: new Date(),
                            info: '日记不存在'
                        })
                    }
                })
            } else {
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '您的token有误'
                })
            }
        })
    } else {
        bossInsertLog('日记操作', `删除日记失败，空参数`)
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    }
})

// 获取博客日志个数
router.post('/getBlogLogCount', (req, res) => {
    const { token } = req.body
    // console.log(token);
    if (token != undefined) {
        mysql.selecter('select * from boss_login', tmpToken => {
            const selectToken = tmpToken[0].token
            if (token === selectToken) {
                mysql.selecter(`select count(*) as count from boss_log`, tmp => {
                    res.send({
                        state: 'success',
                        time: new Date(),
                        info: '获取日志个数成功',
                        data: tmp[0].count,
                    })
                })
            } else {
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '您的token有误'
                })
            }
        })
    } else {
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    }
})

/**
 * 获取博客日志
 * 传入limit,skip
 */
router.post('/getBlogLog', (req, res) => {
    const { token, limit, skip } = req.body
    if (token != undefined && limit != null && limit != undefined && skip != null && skip != undefined) {
        mysql.selecter('select * from boss_login', tmpToken => {
            const selectToken = tmpToken[0].token
            if (token === selectToken) {
                mysql.selecter(`select * from boss_log order by id desc limit ${skip},${limit}`, tmp => {
                    res.send({
                        state: 'success',
                        time: new Date(),
                        info: tmp,
                    })
                })
            } else {
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '您的token有误'
                })
            }
        })
    } else {
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    }

})

/**
 * 设置自我简介
 * 传入text
 */
router.post('/setSelfInfo', (req, res) => {
    const { token, text } = req.body
    if (token != undefined && text != '' && text != null && text != undefined) {
        mysql.selecter('select * from boss_login', tmpToken => {
            const selectToken = tmpToken[0].token
            if (token === selectToken) {
                mysql.set(`update self_Info set text = '${text}' where id = 2`, tmp => {
                    bossInsertLog('自我简介操作', `设置自我简介成功`)
                    res.send({
                        state: 'success',
                        time: new Date(),
                        info: '修改自我简介成功',
                    })
                })
            } else {
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '您的token有误'
                })
            }
        })
    } else {
        bossInsertLog('自我简介操作', `设置自我简介失败`)
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    }
})

/**
 * 添加友情链接
 * 传入title,info,img,link
 */
router.post('/insertLink', (req, res) => {
    const { token, title, info, img, link } = req.body
    if (token != undefined && title != '' && title != null && title != undefined && info != '' && info != null && info != undefined && img != '' && img != null && img != undefined && link != '' && link != null && link != undefined) {
        mysql.selecter('select * from boss_login', tmpToken => {
            const selectToken = tmpToken[0].token
            if (token === selectToken) {
                const createTime = lf.date.format('YYYY-MM-DD hh:mm:ss')
                const id = uuid.v4()
                mysql.set(`insert into blog_link(id,title,info,img,link,createTime) values('${id}', '${title}', '${info}', '${img}', '${link}', '${createTime}');`, tmp => {
                    bossInsertLog('友情链接操作', `添加友情链接${title}成功`)
                    res.send({
                        state: 'success',
                        time: new Date(),
                        info: '添加友情链接成功',
                    })
                })
            } else {
                res.send({
                    state: 'fail',
                    time: new Date(),
                    info: '您的token有误'
                })
            }
        })
    } else {
        bossInsertLog('友情链接操作', `添加友情链接失败`)
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    }
})

module.exports = router