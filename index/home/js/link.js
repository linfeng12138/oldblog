// 背景图地址
const bg = set.imgSrc + '37.jpg'
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
            links: [],
        }
    },
    methods: {
        // 获取链接
        async getLinks() {
            const res = await axios.post(url+'/userWeb/getLink')
            this.links = res.data.info
            console.log(this.links);
        }
    },
    mounted() {
        this.getLinks()
    }
})
