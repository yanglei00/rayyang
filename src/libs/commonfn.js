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
                setTimeout(() => {
                    callback.call(self, rs);
                }, 100);
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
    WechatShareDisable: function () {
        if (!navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
            return
        }
        fetch(zhbh5_host + 'h5service/wx/get', {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "url=" + window.location.href.replace("/&/g", "%26")
        }).then((res) => {
            return res.json();
        }).then((data) => {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名，见附录1
                jsApiList: ["hideMenuItems", "closeWindow"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                // 批量隐藏功能按钮接口
                wx.hideMenuItems({
                    menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:copyUrl", "menuItem:share:email", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:favorite"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });

            });
        }).catch()
    },
    // 列表滑动跳转返回后定位
    listScrollBackPosition(className, method, fetchParams, callback){
        if(method == 'set'){
            sessionStorage.setItem('listScrollparams', JSON.stringify({
                hash: window.location.hash,
                scrollTop: document.getElementsByClassName(className)[0].scrollTop,
                fetchParams: fetchParams || '',
            }))
        }else{
            if (sessionStorage.getItem('listScrollparams')){
                let { hash, scrollTop, fetchParams } = JSON.parse(sessionStorage.getItem('listScrollparams'));
                if(hash == window.location.hash){
                    if (fetchParams.data){
                        if (callback) {
                            callback(fetchParams, () => {
                                setTimeout(() => {
                                    document.getElementsByClassName(className)[0].scrollTo(0, scrollTop)
                                    if (scrollTop) { sessionStorage.removeItem('listScrollparams') }
                                }, 1000);
                            });
                        }
                    }else{
                        if(fetchParams.pageIndex > 1){
                            if(callback){
                                callback(fetchParams, ()=>{
                                    setTimeout(() => {
                                        document.getElementsByClassName(className)[0].scrollTo(0, scrollTop)
                                        if (scrollTop) { sessionStorage.removeItem('listScrollparams') }
                                    }, 1000);
                                });
                            }
                        }else{
                            setTimeout(() => {
                                document.getElementsByClassName(className)[0].scrollTo(0,scrollTop)
                                if (scrollTop) { sessionStorage.removeItem('listScrollparams')}
                            }, 1000);
                        }
                    }
                }
            }
        }
    }
}



export default commonFn
