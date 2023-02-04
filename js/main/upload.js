const lf = require('../tools')
const express = require('express');
const router = express.Router();
const uuid = require('uuid')
const {public_client: oss} = require('../aliy')
const {oss: ossConfig} = require('../config')

// 上传图片
router.post('/upImg', async (req, res) => {
    // console.log(req.files);
    const file = req.files[0]
    const date = lf.date.format('YYYY-MM-DD')
    const url = `${ossConfig.url}${date}/${uuid.v4()}-${file.originalname}`
    const ossRes = await oss.put(url, file.buffer)
    const src = ossRes.res.requestUrls[0]
    console.log(src);
    res.send({
        state: 'success',
        time: new Date(),
        location: src
    })
});
 
module.exports = router;
