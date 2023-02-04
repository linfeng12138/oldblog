// 背景图地址
const bg = set.imgSrc + '5.jpg'
// 设置背景图
const {bgi} = linfengTools
bgi(bg, true, 0.4, '#000')
// 设置浮出动画
const {animat} = linfengTools
animat.text()

const myVue = new Vue({
    el: '#bigBox',
    data() {
        return {
            count: 0,
            diarys: [],
            hide: false,
            // 获取日记次数
            getCount: 0,
            // 一次获取多少条日记
            limit: 7,
        }
    },

    methods: {
        // 获取日记个数
        async getDiaryCount() {
            const res = await axios.post(url+'/userWeb/getDiaryCount')
            this.count = res.data.info
            // console.log(this.count);
        },

        // 获取日记
        async getDiary() {
            const res = await axios.post(url+'/userWeb/getDiaryInfo', {
                skip: this.getCount*this.limit,
                limit: this.limit
            })
            this.diarys.push(...res.data.info)
            this.getCount += 1
            // console.log(this.diarys);
            if(this.getCount * this.limit >= this.count) {
                this.hide = true
            }
        }
    },

    async mounted() {
        // 获取日记个数
        await this.getDiaryCount()
        // 获取日记内容
        await this.getDiary()
    }
})