// 背景图
const { bgi } = linfengTools
bgi(boss.imgUrl, true)
// 浮出文字
const { animat } = linfengTools
animat.text()

const myElement = `
<h2>添加文章</h2>
<table>
    <tr>
        <td>文章标题:</td>
        <td><input type="text" class="title"></td>
    </tr>
    <tr>
        <td>展示内容:</td>
        <td><input type="text" class="info"></td>
    </tr>
</table>
`

// 登录认证 程序入口
async function loginTest() {
    const token = localStorage.getItem(boss.tokenName)
    if (!ifNull(token)) {
        const res = await axios.post(url + '/boss/token', { token })
        if (res.data.state === 'success') {
            const bigBox = document.getElementById('bigBox')
            bigBox.insertAdjacentHTML('afterBegin', myElement);
        }else{
            alert('token失效，请重新登录')
            location.href = './index.html'
        }
    } else {
        alert('token失效，请重新登录')
        location.href = './index.html'
    }
}

loginTest()

document.getElementById('addArticle').onclick = () => {
    const titleElement = document.getElementsByClassName('title')[0]
    const infoElement = document.getElementsByClassName('info')[0]
    const title = titleElement.value
    const info = infoElement.value
    const text = getText()
    console.log(text);
    if (ifNull(title)) {
        alert('标题不可为空')
    } else if (ifNull(info)) {
        alert('展示内容不可为空')
    } else if (ifNull(text)) {
        alert('文本内容不可为空')
    } else {
        axios.post(url + '/boss/insertArticle', {
            title,
            info,
            text,
            token: localStorage.getItem(boss.tokenName)
        }).then(res => {
            // console.log(res);
            if(res.data.state === 'success'){
                alert('文章发布成功')
                location.href = './index.html'
            }else{
                console.log(res.data);
                alert('文章发布失败')
                // location.reload()
            }
        })
    }
}