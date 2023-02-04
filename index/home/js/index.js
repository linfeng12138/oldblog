// 导航地址
const navAddr = general.nav
const lt = linfengTools
// 背景图片
lt.bgi(`${set.imgSrc}${set.defImg}`)
lt.animat.text()
// 顶部文本信息
lt.titleText('给我回来(╯▔皿▔)╯', '别再有下次(○｀ 3′○)')
// 检测移动端并跳转
const { equipment } = linfengTools
equipment.mobile('./mindex.html')


$('.topBox').css({
    'background-image': `url(${set.imgSrc}${set.topImg})`
})

//电梯导航，点击滚动一个页面
$(".bottomIcon").on({
    click() {
        scrollOne()
        set.scroll = false
    }
})

// 首页文章图片（缩略图）
function smallImg() {
    const elements = $('.content li').length
    for (let i = 0; i < elements; i++) {
        const num = Math.floor(Math.random() * set.mImgNum) + 1
        $('.content .bgi').eq(i).css({
            'background-image': `url(${set.smlImg}${num}.jpg)`
        })
    }
}
// smallImg()

// 划过小模块
function hoverBox() {
    $('.content .info').on({
        mouseover() {
            $(this).siblings('.bgi').css({
                filter: 'blur(5px)',
            })
        },
        mouseout() {
            $(this).siblings('.bgi').css({
                filter: 'blur(0px)'
            })
        }
    })


    // 划过显示隐藏小模块
    $('.content .info').hover(function () {
        $(this).children('.smallBottomBox').stop().fadeToggle()
    })
}

// 显示小程序
$('.wxImg').hover(() => {
    $('.wxBox').stop().slideDown(200)
}, () => {
    $('.wxBox').stop().slideUp(200)
})


// 滚动到第一个页面
function scrollOne() {
    let current = $('.toNav').offset().top
    $("body, html").stop().animate({
        scrollTop: current
    }, 400)
    setTimeout(() => {
        $('.topBox').hide()
    }, 450);
}


// 首页的滚动效果
//滚轮事属于鼠标事件 只是滚轮兼容性不一样
//滚轮事件直接加给文档
document.onmousewheel = function () {
    //注意 wheelDelta不是date
    //此方法不兼容火狐浏览器
    // console.log(event.wheelDelta);
    if (event.wheelDelta > 0) {
        // console.log("向上滚动");
    }
    if (event.wheelDelta < 0 && set.scroll) {
        scrollOne()
        set.scroll = false
    }
}
//如何兼容火狐浏览器
//利用
document.addEventListener("DOMMouseScroll", function (e) {
    //火狐浏览器 事件在参数部分就是e
    // console.log("火狐滚轮事件");
    //滚动值
    // console.log(e.detail);
    if (e.detail > 0 && set.scroll) {
        // console.log("火狐滚轮事件向下滚动");
        scrollOne()
        set.scroll = false
    } else {
        // console.log("火狐滚轮事件向上滚动");

    }//正负值与其他浏览器相反
    //尽量以正负值判断上下滚轮
});

// 导航跳转
$('.leftList li').click(function () {
    // console.log(navAddr);
    if (navAddr[$(this).index()] === '') {
        alert('该模块还未完成...')
    } else {
        // console.log(navAddr[$(this).index()]);
        location.href = navAddr[$(this).index()]
    }
})

// 点击头像切换背景图
$('.headImg').click(function () {
    const num = Math.floor(Math.random() * set.imgNum) + 1
    lt.bgi(`${set.imgSrc}${num}.jpg`)
})


// 模拟数据
// const datas = [
//     {
//         id: 1598,
//         title: '博客系统测试数据1',
//         info: '测试数据测试数据测试数据测试数据测试数据',
//         creatDate: '2022-05-20',
//         showNum: '8888',
//     }, {
//         id: 1599,
//         title: '博客系统测试数据2',
//         info: '测试数据测试数据测试数据测试数据测试数据',
//         creatDate: '2022-05-20',
//         showNum: '8888',
//     }, {
//         id: 1600,
//         title: '博客系统测试数据3',
//         info: '测试数据测试数据测试数据测试数据测试数据',
//         creatDate: '2022-05-20',
//         showNum: '8888',
//     }
// ]

const myVue = new Vue({
    el: '#bigBox',
    data() {
        return {
            // 小背景图
            bgStyle: [],
            datas: [],
            // 当前多少页
            num: 0,
            // 一次获取多少条数据
            limit: 4,
            // 隐藏按钮
            hideBtn: false,
            // 搜索内容
            search: '',
        }
    },
    // 侦听器
    watch: {
        // 侦听search
        search(val) {
            if(val.length > 10){
                const temp = val.slice(0, 10)
                this.setSearchText(temp)
            }else if(myToolRegexContainSpecial(val)) {
                const temp = val.slice(0, val.length-1)
                this.setSearchText(temp)
            }
        }
    },
    methods: {
        // 搜索文章
        async searchArticle(){
            if(ifNull(this.search)){
                alert('搜索内容不可为空')
            }else if(this.search.length > 10){
                alert('搜索字符不得超过十个')
            }else if(myToolRegexContainSpecial(this.search)){
                alert('不可有特殊字符')
            }else{
                const res = await axios.post(url + '/userWeb/searchArticle', {
                    text: this.search
                })
                const tmpArr = res.data.info
                if(tmpArr.length <= 0){
                    alert('未搜索到任何数据')
                }else{
                    this.hideBtn = true
                    this.datas = [...tmpArr]
                }
            }
            // const res = 
        },
        // 设置search文本方式xss注入
        setSearchText(val) {
            this.search = val
        },
        mouseenter(index, element) {
            const tmp = element.getElementsByClassName('bgi')[0]
            tmp.style.filter = 'blur(5px)'
        },
        mouseleave(index, element) {
            const tmp = element.getElementsByClassName('bgi')[0]
            tmp.style.filter = 'blur(0px)'
        },
        // 分页获取文章信息
        async page() {
            this.bgi()
            // 获取文章数量
            const tmp = await axios.post(url + '/userWeb/getBlogCount')
            this.countNum = tmp.data.info
            // console.log(this.countNum);
            if (this.countNum > this.num * this.limit) {
                const dataArticle = await axios.post(url + '/userWeb/getBlogInfo', {
                    skip: this.num * this.limit,
                    limit: this.limit,
                })
                this.datas.push(...dataArticle.data.info)
                this.num += 1
                // console.log(dataArticle.data.info);
                if(this.num * this.limit >= this.countNum){
                    this.hideBtn = true
                }
            } else {
                this.hideBtn = true
            }
        },

        // 文章首页随机图片
        bgi(){
            let tmp = []
            for (let i = 0; i < this.limit; i++) {
                const numTmp = Math.floor(Math.random() * set.mImgNum) + 1
                tmp[i] = {backgroundImage: `url(${set.smlImg}${numTmp}.jpg)`}
            }
            this.bgStyle.push(...tmp)
            // console.log(this.bgStyle);
        },

        // 点击文章跳转
        async gotoArticle(id) {
            // 自增阅读数
            await axios.post(url + '/userWeb/addReadNum', {
                id: id
            })
            location.href = `./view/article.html?id=${id}`
        }
    },
    async mounted() {
        // this.bgi()
        // 分页获取文章信息
        await this.page()
        // 文章首页图片初始化
        // smallImg()

    }

})