const {oss: ossConfig} = require('./config')
const oss = require('ali-oss')

// oss配置
const public_client = new oss({
    region: ossConfig.region,
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: ossConfig.ram_id,
    accessKeySecret: ossConfig.ram_secret,
    // 填写Bucket名称。
    bucket: ossConfig.bucket
});

//上传文件到static，公共区域，此区域文件所有人可以访问
//直接返回文件路径
// exports.uploadCommonFile = async ({ body, files }) => {
//     const { type = 'temp' } = body;

//     if (!files || files.length === 0) {
//         throw new Error(JSON.stringify({
//             code: 40001,
//             msg: '文件不存在',
//         }))
//     }
//     const file = files[0];
//     const name = 'testTmp/schoolCar/' + type + '/' + uuid() + file.originalname;
//     const res = await public_client.put(name, file.buffer);
//     console.log(res);
//     return res.url;
// }

module.exports = {
    public_client,
}