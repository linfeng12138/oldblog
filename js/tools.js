/**
 * 判断是否为空值
 * @param {*} value 
 * @returns boolean
 * 若为空返回true 也可检测数组
 */
function myToolNullValue(value) {
    if (value === null || value === undefined || value === '' || value.length === 0) {
        return true
    } else {
        return false
    }
}

/**
 * 判断是否为空，包括是否为空格
 * @param {String} par 需要判断是否为空的值
 * @returns 若为空返回true否则返回false
 */
 function ifNull(par) {
    if (par === undefined || par === null || par === '' || par.trim().length === 0) {
        return true
    }
    return false
}


/**
 * 日期默认转换为YY-MM-DD hh mm ss格式
 * @param {date} date 需要转换的日期 可不写
 * @returns 转换后的日期
 */
function myToolFormatDateDefault(date) {
    if (myToolNullValue(date)) {
        date = new Date()
    }
    let YY = date.getFullYear() + '-';
    let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD + " " + hh + mm + ss;
}


/**
 * 根据指定格式进行格式化日期
 * @param {string} fmt 格式 例如："YYYY-MM-DD hh:mm"
 * @param {date} date 日期对象
 * @returns 返回格式化完成的字符串
 * Y年 M月 D日 h时 m分 s秒
 */
function myToolFormatDate(date, fmt) {
    if (typeof date === 'string') {
        fmt = date
        date = new Date()
    }
    if (myToolNullValue(date)) {
        date = new Date()
    }
    if (myToolNullValue(fmt)) {
        fmt = "YYYY-MM-DD hh:mm:ss"
    }
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "D+": date.getDate().toString(),            // 日
        "h+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

module.exports = {
    // 日期工具
    date: {
        // 简易格式化日期
        fd: myToolFormatDateDefault,
        // 自定义格式化日期
        format: myToolFormatDate,
    },

    // 判断空值
    ifNull,
}