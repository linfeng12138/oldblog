const bg = set.imgSrc + '71.jpg'
const {bgi} = linfengTools
bgi(bg, true, 0.5, '#000')
const {animat} = linfengTools
animat.text()

// 设置文本
async function getText() {
    const res = await axios.post(url+'/userWeb/getSelfInfo')
    const text = res.data.info
    document.getElementsByClassName('text')[0].innerHTML = text
    
}
// getText()

const myVue = new Vue({
    el: '#bigBox',
    data() {
        return {
            text: 'loading...',
        }
    },
    async mounted() {
        const res = await axios.post(url+'/userWeb/getSelfInfo')
        this.text = res.data.info
    }
})