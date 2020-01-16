//  时间格式化
// export function dateFormat(date, fmt) {
//     var date = new Date() //时间戳为10位需*1000，时间戳为13位的话不需乘1000
//     var Y = date.getFullYear() + '-'
//     var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
//     var D = (date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate()) + ' '
//     var h = (date.getHours()< 10 ? '0'+(date.getHours()) : date.getHours()) + ':'
//     var m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':'
//     var s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds())
//     return Y+M+D+h+m+s
// }


class DateAPI {

    /**
    
    * 将输入的毫秒字符串or毫秒数转换成指定的字符串格式
    
    * @param {string} msStr 毫秒字符串 or 毫秒数
    
    * @param {string} format yyyy-MM-dd or yyyy-MM-dd hh:mm:ss
    
    * @return {string} 转换后的字符串
    
    */
    
    static format(msStr, format) {
    
    const date = new Date(msStr / 1);
    
    let fmt = format;
    
    const obj = {
    
    'M+': date.getMonth() + 1, // 月份
    
    'd+': date.getDate(), // 日
    
    'h+': date.getHours(), // 小时
    
    'm+': date.getMinutes(), // 分
    
    's+': date.getSeconds(), // 秒
    
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    
    S: date.getMilliseconds(), // 毫秒
    
    };
    
    if (/(y+)/.test(fmt)) {
    
    fmt = fmt.replace(RegExp.$1, (String(date.getFullYear())).substr(4 - RegExp.$1.length));
    
    }
    
    const keys = Object.keys(obj);
    
    for (let i = 0; i <= keys.length; i += 1) {
    
    const k = keys[i];
    
    if (new RegExp(`(${k})`).test(fmt)) {
    
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (obj[k]) : ((`00${obj[k]}`).substr((String(obj[k])).length)));
    
    }
    
    }
    
    return fmt;
    
    }
    
    /**
    
    * 获得传入的秒字符串msStr距离现在时间的字符串，格式为 昨天 今天 明天 当前年3月4日 其余2000-01-01
    
    * @param {string} msStr 毫秒字符串
    
    * @return {string} 可以显示用的字符串
    
    */
    
    static format2(msStr, showYear) {
    
    let ms = new Date(DateAPI.format(msStr, 'yyyy/MM/dd')).getTime() / 1000;
    
    const now = new Date(DateAPI.format(new Date().getTime(), 'yyyy/MM/dd')).getTime() / 1000;
    
    ms = now - ms;
    
    const min = 60;
    
    const hour = 60 * min;
    
    const day = 24 * hour;
    
    if (ms === 0) {
    
    return '今天';
    
    }
    
    if (ms === day) {
    
    return '昨天';
    
    }
    
    if (ms === -day) {
    
    return '明天';
    
    }
    
    const date = new Date((msStr / 1));
    
    const nowYear = new Date().getFullYear();
    
    const year = date.getFullYear();
    
    const month = date.getMonth() + 1;
    
    if (showYear === false && year === nowYear) {
    
    return `${month}月${date.getDate()}日`;
    
    }
    
    return `${date.getFullYear()}年${month}月${date.getDate()}日`;
    
    }
    
    /**
    
    *获取当前天数之前或者之后的日期
    
    *@num 之前或者之后多少天数 - 表示之前
    
    */
    
    static getDate(num, format) {
    
    const today = new Date();
    
    const targetday = today.getTime() + (1000 * 60 * 60 * 24 * num);
    
    const target = new Date();
    
    target.setTime(targetday);
    
    if (format) {
    
    return this.format(target.getTime(), format);
    
    }
    
    return target;
    
    }
    
    }
    
    export default DateAPI;