// 背景图
const { bgi } = linfengTools
bgi(boss.imgUrl, true)
// 浮出文字
const { animat } = linfengTools
animat.text()

// 导航数据
const navData = [
    {
        text: '添加文章',
        src: './assets/images/icon_addArticle.png',
        selectedNav: true,
    },
    {
        text: '删除文章',
        src: './assets/images/icon_editArticle.png',
        selectedNav: false,
    },
    {
        text: '添加日记',
        src: './assets/images/icon_add_diary.png',
        selectedNav: false,
    },
    {
        text: '删除日记',
        src: './assets/images/icon_delete_diary.png',
        selectedNav: false,
    },
    {
        text: '友情链接',
        src: './assets/images/icon_link.png',
        selectedNav: false,
    },
    {
        text: '自我简介',
        src: './assets/images/icon_selfInfo.png',
        selectedNav: false,
    },
    {
        text: '博客日志',
        src: './assets/images/icon_log.png',
        selectedNav: false,
    },
    {
        text: '退出登录',
        src: './assets/images/icon_exit.png',
        selectedNav: false,
    }
]

// 单击导航事件
// function navClick() {
//     $('.navBox li').click(function () {
//         console.log('aaa');
//         $(this).addClass('selectedNav').siblings().removeClass('selectedNav')
//         console.log($(this).index());
//     })
// }

// navClick()


// 自定义指令 聚焦
Vue.directive('focus', {
    inserted: function (el) {
        // el表示指令所绑定的元素
        // focus()聚焦
        el.focus()
        // 设置默认值
        el.value = 'linfeng'
    }
})

// 创建vue实例
const myVue = new Vue({
    el: '#bigBox',
    data() {
        return {
            // tmp: [],
            login: false,
            user: '',
            pwd: '',
            // 导航数据
            navInfo: navData,
            // 文章大盒子数据同时绑定导航数据
            contentBox: [false, true, true, true, true, true, true, true],
            tiny: '',
            // 文章
            article: {
                skip: 0,
                // 一次获取多少条文章数据
                limit: 10,
                // 文章个数
                count: 0,
                // 文章数据
                list: [],
                // 加载更多按钮是否隐藏
                hide: false,
            },
            // 日记
            diary: {
                // 添加日记内容
                addText: '',
                // 日记总个数
                count: 0,
                // 日记数据
                list: [],
                // 获取日记次数
                getCount: 0,
                // 获取日记个数
                limit: 10,
                // 加载更多按钮是否隐藏
                hide: false,
            },
            // 自我介绍
            selfInfoText: '',
            // 博客日志
            log: {
                // 日志总个数
                count: 0,
                // 日志数据
                list: [],
                // 获取日志次数
                getCount: 0,
                // 获取日志个数
                limit: 20,
                // 加载更多按钮是否隐藏
                hide: false,
            },
            // 友情链接
            link: {
                // 展示标题
                title: '',
                // 显示内容
                info: '',
                // 图片路径
                img: '',
                // 链接地址
                link: '',
            }
        }
    },
    methods: {
        // 登录
        async goLogin() {
            if (ifNull(this.user)) {
                alert('用户名不可为空')
            } else if (ifNull(this.pwd)) {
                alert('密码不可为空')
            } else if (myToolRegexUser(this.user) || myToolRegexUser(this.pwd)) {
                alert('不可含有特殊符号')
            } else if (this.user.length > 20 || this.pwd.length > 20) {
                alert('用户名或密码过长')
            } else {
                const userEnterInfo = {
                    user: this.user,
                    pwd: this.pwd
                }
                const res = await axios.post(url + '/boss/login', userEnterInfo)
                if (res.data.state === 'fail') {
                    alert(res.data.info)
                } else if (res.data.state === 'success') {
                    localStorage.setItem(boss.tokenName, res.data.token)
                }
                location.reload()
            }
        },

        // 导航单击事件
        selectedNav(index) {
            if (index === 7) {
                localStorage.removeItem(boss.tokenName)
                location.reload()
                return
            } else if (index === 1) {
                this.onLoadDeleteArticleList()
            } else if (index === 2) {
                this.initDiary()
            } else if (index === 3) {
                this.initDeleteDiary()
            } else if (index === 4) {
                this.initLink()
            } else if (index === 5) {
                this.initSetSelfInfo()
            } else if (index === 6) {
                this.initBlogLog()
            }
            for (let i = 0; i < this.contentBox.length; i++) {
                if (i === index) {
                    this.contentBox[i] = false
                    this.navInfo[i].selectedNav = true
                } else {
                    this.contentBox[i] = true
                    this.navInfo[i].selectedNav = false
                }
            }

        },

        // 初始化友情链接
        async initLink() {
            this.link.title = ''
            this.link.info = ''
            this.link.img = ''
            this.link.link = ''
        },

        // 添加友情链接
        async addLink() {
            if (ifNull(this.link.title)) {
                alert('标题不可为空')
            } else if (ifNull(this.link.info)) {
                alert('内容不可为空')
            } else if (ifNull(this.link.img)) {
                alert('图片不可为空')
            } else if (ifNull(this.link.link)) {
                alert('链接不可为空')
            } else {
                const res = await axios.post(url + '/boss/insertLink', {
                    title: this.link.title,
                    info: this.link.info,
                    img: this.link.img,
                    link: this.link.link,
                    token: localStorage.getItem(boss.tokenName)
                })
                if (res.data.state === 'fail') {
                    alert(res.data.info)
                } else if (res.data.state === 'success') {
                    alert('添加成功')
                    this.initLink()
                }
            }
        },

        // 初始化删除文章列表
        async onLoadDeleteArticleList() {
            this.article.list = []
            this.article.skip = 0
            // 获取文章总个数
            const res = await axios.post(url + '/userWeb/getBlogCount')
            this.article.count = res.data.info
            // 获取文章列表
            this.getArticleList()
        },

        // 获取文章列表
        async getArticleList() {
            if (this.article.skip < this.article.count) {
                const res = await axios.post(url + '/userWeb/getBlogInfo', {
                    skip: this.article.skip,
                    limit: this.article.limit,
                })
                this.article.skip += this.article.limit
                this.article.list.push(...res.data.info)
                // console.log(this.article.list);
                if (this.article.list.length >= this.article.count) {
                    this.article.hide = true
                }
            } else {
                this.article.hide = true
            }
        },

        // 删除文章
        async deleteArticle(id) {
            console.log(id);
            const res = await axios.post(url + '/boss/deleteArticle', {
                id: id,
                token: localStorage.getItem(boss.tokenName)
            })
            console.log(res.data);
            if (res.data.state === 'fail') {
                alert(res.data.info)
            } else if (res.data.state === 'success') {
                alert(res.data.info)
                this.onLoadDeleteArticleList()
            }
        },

        // 前往发布文章页面
        gotoAddArticle() {
            location.href = './addArticle.html'
        },

        // 初始化添加日记页面
        async initDiary() {
            this.diary.addText = ''
        },

        // 添加日记
        async addDiary() {
            if (ifNull(this.diary.addText)) {
                alert('日记内容不可为空')
            } else {
                const res = await axios.post(url + '/boss/insertDiary', {
                    text: this.diary.addText,
                    token: localStorage.getItem(boss.tokenName)
                })
                if (res.data.state === 'fail') {
                    alert(res.data.info)
                } else if (res.data.state === 'success') {
                    alert(res.data.info)
                    this.initDiary()
                }
            }
        },

        // 初始化删除日记
        async initDeleteDiary() {
            this.diary.list = []
            this.diary.count = 0
            this.diary.getCount = 0
            this.diary.hide = false
            await this.getDiaryCount()
            await this.getDiaryList()
        },

        // 获取日记总个数
        async getDiaryCount() {
            const res = await axios.post(url + '/userWeb/getDiaryCount')
            this.diary.count = res.data.info
            // console.log(this.diary.count);
        },

        // 获取日记列表
        async getDiaryList() {
            const res = await axios.post(url + '/userWeb/getDiaryInfo', {
                skip: this.diary.getCount * this.diary.limit,
                limit: this.diary.limit,
            })
            this.diary.getCount += 1
            this.diary.list.push(...res.data.info)
            // console.log(this.diary.list);
            if (this.diary.getCount * this.diary.limit >= this.diary.count) {
                this.diary.hide = true
            }
        },

        // 删除日记
        async deleteDiary(id) {
            const res = await axios.post(url + '/boss/deleteDiary', {
                id: id,
                token: localStorage.getItem(boss.tokenName)
            })
            if (res.data.state === 'fail') {
                alert(res.data.info)
            } else if (res.data.state === 'success') {
                this.initDeleteDiary()
            }
        },

        // 初始化自我介绍
        async initSetSelfInfo() {
            this.selfInfoText = ''
        },

        // 设置自我简介
        async setSelfInfo() {
            // console.log(this.selfInfoText);
            if (ifNull(this.selfInfoText)) {
                alert('自我简介不可为空')
            } else {
                const res = await axios.post(url + '/boss/setSelfInfo', {
                    text: this.selfInfoText,
                    token: localStorage.getItem(boss.tokenName)
                })
                // console.log(res.data);
                if (res.data.state === 'fail') {
                    alert(res.data.info)
                } else {
                    alert(res.data.info)
                    this.initSetSelfInfo()
                }
            }
        },


        // 博客日志初始化
        async initBlogLog() {
            this.log.list = []
            this.log.count = 0
            this.log.getCount = 0
            this.log.hide = false
            await this.getBlogLogNum()
            await this.getBlogLog()
        },

        // 获取博客日志个数
        async getBlogLogNum() {
            const res = await axios.post(url + '/boss/getBlogLogCount', {
                token: localStorage.getItem(boss.tokenName)
            })
            // console.log(res.data);
            this.log.count = res.data.data
            if(res.data.state === 'fail'){
                // alert(res.data.info)
                this.log.count = 0
                // this.log.list = []
            }
            // console.log(this.log.count);
        },

        // 获取博客日志信息
        async getBlogLog() {
            const res = await axios.post(url + '/boss/getBlogLog', {
                skip: this.log.getCount * this.log.limit,
                limit: this.log.limit,
                token: localStorage.getItem(boss.tokenName)
            })
            if(res.data.state === 'fail'){
                alert(res.data.info)
                this.log.hide = true
            }else{
                // console.log(res);
                this.log.getCount += 1
                this.log.list.push(...res.data.info)
                if (this.log.getCount * this.log.limit >= this.log.count) {
                    this.log.hide = true
                }
            }
            // console.log(res);
        }
    },


    // 初始化
    async mounted() {
        // 登录认证
        const token = localStorage.getItem(boss.tokenName)
        if (!ifNull(token)) {
            const res = await axios.post(url + '/boss/token', { token })
            if (res.data.state === 'success') {
                this.login = true
            }
        }

    },
})
