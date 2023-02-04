const navAddr = general.nav
const lt = linfengTools
// 背景图片
lt.bgi(setm.imgSrc)
lt.animat.text()

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

// 导航跳转
$('.leftList li').click(function () {
    if (navAddr[$(this).index()] === '') {
        alert('该模块还未完成...')
    } else {
        location.href = navAddr[$(this).index()]
    }
})

// 点击头像切换背景图
$('.headImg').click(function () {
    const num = Math.floor(Math.random() * set.imgNum) + 1
    lt.bgi(`${set.imgSrc}${num}.jpg`)
})


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
        }
    },
    methods: {
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
                if (this.num * this.limit >= this.countNum) {
                    this.hideBtn = true
                }
            } else {
                this.hideBtn = true
            }
        },

        // 文章首页随机图片
        bgi() {
            let tmp = []
            for (let i = 0; i < this.limit; i++) {
                const numTmp = Math.floor(Math.random() * set.mImgNum) + 1
                tmp[i] = { backgroundImage: `url(${set.smlImg}${numTmp}.jpg)` }
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