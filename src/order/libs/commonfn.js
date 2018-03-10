import Cookies from 'js-cookie';
import createHistory from 'history/createHashHistory'
const history = createHistory();
// console.log(history)
var commonFn = {
    history: history,
    urlEncode: function(param, key, encode) {
        if (param == null) {
            return '';
        }
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += commonFn.urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    },
    // data64  转 blob
    dataURLtoBlob : (urlData) => {
        var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte

        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], { type: 'image/png' });

    },
    getNewToken: function (data, callback) {
        let send_data = {
            ...data
        }
        fetch(zhbh5_host + 'h5service/token/getNewToken',{
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode(send_data),
        }).then((rs)=>{
            return rs.json()
        }).then((rs)=>{
            Cookies.set('access_token', rs.newToken, { expires: 3, path: '/' });
            if (callback) {
                callback.call(self, rs);
            }
        });

    },
    // js中获取URL中指定的查询字符串
    getUrlAttribute: function(parameName) {
        //location.search是从当前URL的?号开始的字符串，即查询字符串
        var query = (window.location.href.indexOf('?') > 0 ? window.location.href.split('?')[1] : null);
        if (null != query) {
            var args = new Object();
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf("=");
                if (pos == -1)
                    continue;
                var argname = pairs[i].substring(0, pos);
                var value = pairs[i].substring(pos + 1);
                value = decodeURIComponent(value);
                args[argname] = value;
            }
            //根据键名获取值
            return args[parameName];
        }
        return null;
    },
    getHashUrl: function(parameName) {
        //location.search是从当前URL的?号开始的字符串，即查询字符串
        var query = (window.location.hash.indexOf('?') > 0 ? window.location.hash.split('?')[1] : null);
        if (null != query) {
            var args = new Object();
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf("=");
                if (pos == -1)
                    continue;
                var argname = pairs[i].substring(0, pos);
                var value = pairs[i].substring(pos + 1);
                value = decodeURIComponent(value);
                args[argname] = value;
            }
            //根据键名获取值
            return args[parameName];
        }
        return null;
    },
    // 数据json格式化
    formatComponentData: (data = {}, callback) => {
        let arr = [];
        if (data) {
            console.log(data)
            data.map((o, i) => {
                arr.push(
                    callback(o)
                );
            });
            return arr;
        }
    },
    // 手机号加密
    encryptPhone: (phone) => {
        if (phone) {
            return String(phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        }
    },
    // 一维数组 转化成二维数组
    ArrayFormatData: (arr) => {
        var tempArr = [];
        for (var i = 0; i < Math.ceil(arr.length / 2); i++) {
            tempArr[i] = [];
            tempArr[i].push(arr[2 * i]);
            tempArr[i].push(arr[2 * i + 1]);
        }
        return tempArr;
    },
    
}



export default commonFn
