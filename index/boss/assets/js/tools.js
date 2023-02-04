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