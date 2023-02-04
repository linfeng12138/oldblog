const lf = require('../tools')
const express = require('express');
const router = express.Router();
const uuid = require('uuid')
const mysql = require('./../mysql')

// 获取自己信息(个人简介)
router.post('/getSelfInfo', (req, res) => {
    mysql.selecter(`select * from self_Info order by id desc limit 1`, tmp => {
        res.send({
            state: 'success',
            time: new Date(),
            info: tmp[0].text
        })
    })
})

/**
 * 获取博客主要内容信息
 * @param {string} skip 跳过的条数
 * @param {string} limit 获取的条数
 */
router.post('/getBlogInfo', (req, res) => {
    const { skip, limit } = req.body
    if (skip === undefined || skip === null || limit === undefined || limit === null || skip < 0 || limit <= 0) {
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    } else {
        mysql.selecter(`select * from blog_main order by createTime desc limit ${skip},${limit}`, tmp => {
            res.send({
                state: 'success',
                time: new Date(),
                info: tmp
            })
        })
    }
})

// 获取文章总个数
router.post('/getBlogCount', (req, res) => {
    mysql.selecter(`select count(*) as count from blog_main`, tmp => {
        res.send({
            state: 'success',
            time: new Date(),
            info: tmp[0].count
        })
    })
})

// 文章阅读人数自增
router.post('/addReadNum', (req, res) => {
    let { id } = req.body
    id = String(id)
    if (lf.ifNull(id)) {
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    } else {
        mysql.set(`update blog_main set showNum = showNum + 1 where id='${id}';`, tmp => {
            res.send({
                state: 'success',
                time: new Date(),
                info: '更新成功'
            })
        })
    }
})


// 通过id获取单个文章信息
router.post('/getBlogInfoById', (req, res) => {
    let { id } = req.body
    id = String(id)
    if (lf.ifNull(id)) {
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空',
        })
    } else {
        mysql.selecter(`select * from blog_main where id='${id}'`, tmp => {
            res.send({
                state: 'success',
                time: new Date(),
                info: tmp[0]
            })
        })
    }
})

// 获取日记总个数
router.post('/getDiaryCount', (req, res) => {
    mysql.selecter(`select count(*) as count from blog_diary`, tmp => {
        res.send({
            state: 'success',
            time: new Date(),
            info: tmp[0].count
        })
    })
})

/**
 * 获取日记主要内容信息
 * limit 获取的条数
 * skip 跳过的条数
 */
router.post('/getDiaryInfo', (req, res) => {
    const { skip, limit } = req.body
    if (skip === undefined || skip === null || limit === undefined || limit === null || skip < 0 || limit <= 0) {
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数不可为空'
        })
    } else {
        mysql.selecter(`select * from blog_diary order by createTime desc limit ${skip},${limit}`, tmp => {
            res.send({
                state: 'success',
                time: new Date(),
                info: tmp
            })
        })
    }
})

// 获取友情链接
router.post('/getLink', (req, res) => {
    mysql.selecter(`select * from blog_link`, tmp => {
        res.send({
            state: 'success',
            time: new Date(),
            info: tmp
        })
    })
})

/**
 * 搜索文章
 * 传入text
 */
router.post('/searchArticle', (req, res) => {
    const { text } = req.body
    if(text === null || text === undefined || text === '' || text.length > 10 || typeof text != 'string'){
        res.send({
            state: 'fail',
            time: new Date(),
            info: '参数有误'
        })
    } else {
        mysql.selecter(`select * from blog_main where title regexp '${text}' or info regexp '${text}' order by createTime desc`, tmp => {
            res.send({
                state: 'success',
                time: new Date(),
                info: tmp
            })
        })
    }
})

module.exports = router