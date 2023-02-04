// 背景图地址
const bg = set.imgSrc + '92.jpg'
// 设置背景图
const {bgi} = linfengTools
bgi(bg, true, 0.7, '#000')
// 设置浮出动画
const {animat} = linfengTools
animat.text()
// 获取导航传参
const {getData} = linfengTools
const id = getData('id')
// 日期格式化
const {date} = linfengTools
// 顶部文本信息
linfengTools.titleText('给我回来(╯▔皿▔)╯', '别再有下次(○｀ 3′○)')

// 将文字渲染到页面
function renderText(data) {
    document.getElementsByTagName('h2')[0].innerHTML = data.title
    document.getElementsByClassName('content')[0].innerHTML = data.text
    document.title = data.title
    let time = new Date(data.createTime)
    time = date.format(time, 'YY-MM-DD hh:mm:ss')
    document.getElementsByClassName('time')[0].innerHTML = time
}

// 获取文章内容 程序入口
async function getArticle() {
    const res = await axios.post(url+'/userWeb/getBlogInfoById', {id})
    const data = res.data.info
    renderText(data)
}

getArticle()