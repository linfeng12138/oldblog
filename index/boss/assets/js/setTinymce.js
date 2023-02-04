// 上传图片地址
const upImgUrl = `${url}/upload/upImg`

const tiny = tinymce.init({
    // 确定类
    selector: '#myTinymce',
    // 设置高
    height: '100%',
    // 初始化内联模式
    init: true,
    // 使用中文包
    language: 'zh_CN',
    // 禁止拖动
    resize: false,
    // 隐藏右下角技术支持
    branding: false,
    // 上传图片，首先要启用图片插件
    plugins: 'image lists preview emoticons link',
    // 在工具栏显示图片工具按钮
    // toolbar: 'image',
    // 此参数用于指定一个接受上传文件的后端处理程序地址
    images_upload_url: upImgUrl,
    // 自定义工具栏
    toolbar1: "undo redo | styleselect | bold italic | alignleft aligncenter alignright",
    toolbar2: "numlist bullist image emoticons preview link",
});

// 获取富文本内容
function getText() {
    return tinymce.activeEditor.getContent()
}

