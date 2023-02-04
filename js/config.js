// 阿里云oss配置
const oss = {
    // 存储路径
    url: '/blog/upload/',

    // 阿里云OSS RAM
    ram_id: '',
    ram_secret: '',
    bucket: '',
    region: '',
    // image_public_url: 'https://tmx-public.oss-cn-beijing.aliyuncs.com/',
}

// MySQL数据库
const sql = {
    // 主机
    host: '',
    // 用户
    user: '',
    // 密码
    password: '',
    // 数据库
    database: '',
}

module.exports = {
    oss,
    sql,
}