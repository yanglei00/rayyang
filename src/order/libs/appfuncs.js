import Cookies from 'js-cookie';
import commonFn from './commonfn';


const history = commonFn.history;


// js中获取URL中指定的查询字符串
function getUrlAttribute(parameName) {
    //location.search是从当前URL的?号开始的字符串，即查询字符串
    var query = (history.location.search.length > 0 ? history.location.search.substring(1) : null);
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

}
;

// 平台
function isApp() {
    var u = window.navigator.userAgent;

    if (navigator.userAgent.indexOf('APX_iOS') > -1 || navigator.userAgent.indexOf('APX_Android') > -1) { // app接入
        return true;
    } else { // 微网站接入
        return false;
    }
    ;
}
;
function isAndroid() {
    if (navigator.userAgent.indexOf('APX_Android') > -1) { // android接入
        return true;
    } else { // 微网站接入
        return false;
    }
    ;
}
;
function isIos() {
    if (navigator.userAgent.indexOf('APX_iOS') > -1) { // ios接入
        return true;
    } else { // 微网站接入
        return false;
    }
    ;
}
;
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
    ;
}
;
// 判断url 中 ？号
function url_symbol() {
    var url_if = '';
    location.href.indexOf('?') > -1 ? url_if = '&' : url_if = '?';
    return url_if;
}
// 判断url_openby
function has_openby() {

    if (location.href.indexOf('openby:zhbservice') > -1) {
        return true
    } else {
        return false
    }
}
// 当前页面的url  ?号之前的部分

function url_current() {
    let linkUrl = '';
    return linkUrl = window.location.href.indexOf('?') > 0 ? window.location.href.split('?')[0] : window.location.href;
}
// url_openby
function url_openby(options) {
    if (has_openby()) {
        if (isAndroid()) { // 安卓要单独去除hash
            window.location.href = location.href.replace(/(\#)/g, '').split('openby:zhbservice=')[0] + options;
        } else {
            window.location.href = location.href.split('openby:zhbservice=')[0] + options;
        }

    } else {
        if (isAndroid()) { // 安卓要单独去除hash
            window.location.href = location.href.replace(/(\#)/g, '') + url_symbol() + options;
        } else {
            window.location.href = location.href + url_symbol() + options;
        }

    }
}

function is_ios() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/mac/i) == "mac") {
        return true;
    } else {
        return false;
    }
    ;
}
;
function is_android() {
    if (navigator.userAgent.indexOf('Android') > -1) { // android接入
        return true;
    } else { // 微网站接入
        return false;
    }
    ;
}
var appFunc = {
    isApp: isApp(),
    isAndroid: isAndroid(),
    isIos: isIos(),
    is_weixn: is_weixn(),
    is_android: is_android(),
    is_ios: is_ios(),
    // app返回  二级返回一级
    appBack: function(router) {
        if (isApp()) {
            if (isIos()) {
                apxInterface.pop();
            } else if (isAndroid()) { // 安卓的桥

                window.js2android.finishPage(); // 跳转到
            }
            ;
        } else {
            if (router) {
                history.push('/' + router)
            } else {
                window.history.back();
            }
        }
    },
    toAppSetPayPassword: function() {
        //设置密码
        if (isApp()) {
            if (isIos()) {
                apxInterface.toAppSetPayPassword();
            } else if (isAndroid()) { // 安卓的桥
                window.js2android.toAppSetPayPassword(); // 跳转到
            }
        }
    },
    toAppForgetPayPassword: function() {
        //设置密码
        if (isApp()) {
            if (isIos()) {
                apxInterface.toAppForgetPayPassword();
            } else if (isAndroid()) { // 安卓的桥
                if (window.js2android.toAppForgetPayPassword) {
                    window.js2android.toAppForgetPayPassword(); // 跳转到
                }
            }
        }
    },
    toAppHome: function() {
        if (isIos()) {
            apxInterface.toAppHome()
        } else if (isAndroid()) {
            url_openby('openby:zhbservice={"action":"go.toAppHome"}')
        }
    },
    navigationBarUpdated: function(title, type) {
        //设置密码
        if (isIos()) {
            // var goToHomeCommnd = ["", "APXInterface", "navigationBarUpdated", [title, type]];
            // window.webkit.messageHandlers.cordova.postMessage(goToHomeCommnd);
            apxInterface.navigationBarUpdated([title, type])
        } else if (isAndroid()) { // 安卓的
            if (window.js2android.navigationBarUpdated) {
                window.js2android.navigationBarUpdated(title, type); // 跳转到
            }
        // window.js2android.navigationBarUpdated(title, type); // 跳转到
        }
    },
    needLogin: function() {
        var needLogin = false;
        if (!Cookies.get('uid') && isAndroid()) {
            needLogin = true;
        //this.twoGotoAppLogin();
        } else if (!Cookies.get('uid') && isIos()) {
            needLogin = true;
        }
        if (!isApp() && !Cookies.get('uid')) {
            needLogin = true;
        }
        return needLogin;
    },
    //重置用户信息
    resetInfo: function(info, needReLoad) {
        Cookies.set('uid', (info.uid || ''), {
            expires: 3,
            path: '/'
        });

        Cookies.set('access_token', (info.token || ''), {
            expires: 3,
            path: '/'
        });

        Cookies.set('mobile', (info.mobile || ''), {
            expires: 3,
            path: '/'
        });

        if (needReLoad) {
            window.reLoadIndex();
        }
    },
    // app一级webview 跳转二级webview
    oneToTwoWebview: function(router, title, type, navStyle, share, isReturn) {

        let linkUrl = url_current().split('#/')[0] + '#/' + router;
        let shareParams = ''
        if (share) {
            shareParams = ',"shareTitle":"' + share.title + '","shareContent":"' + share.desc + '","shareUrl":"' + share.link + '","sharePic":"' + share.imgUrl + '"';

        // console.log(navStyle)
        }
        if (isReturn) {
            if (type == 'allUrl') {
                return 'openby:zhbservice={"action":"go.h5","params":{"linkUrl":"' + encodeURIComponent(router) + '","title":"' + title + '","type":"0","navStyle":"' + navStyle + '"' + shareParams + '}}';
            } else {
                return 'openby:zhbservice={"action":"go.h5","params":{"linkUrl":"' + encodeURIComponent(linkUrl) + '","title":"' + title + '","type":"0","navStyle":"' + navStyle + '"' + shareParams + '}}';
            }

        } else {
            if (isApp()) { //App来
                if (isAndroid()) {
                    navStyle = 11;
                }
                if (type == 'allUrl') {

                    url_openby('openby:zhbservice={"action":"go.h5","params":{"linkUrl":"' + encodeURIComponent(router) + '","title":"' + title + '","type":"0","navStyle":"' + navStyle + '"' + shareParams + '}}');
                } else {

                    url_openby('openby:zhbservice={"action":"go.h5","params":{"linkUrl":"' + encodeURIComponent(linkUrl) + '","title":"' + title + '","type":"0","navStyle":"' + navStyle + '"' + shareParams + '}}');
                }

            } else { // 微网站
                if (type == 'allUrl') {
                    window.location.href = router;
                } else {
                    history.push('/' + router)
                }
            }
            ;
        }
    },
    // h5 页面唤起app分享 传入分享信息
    h5CallAppShare: function(options) {
        // var shareMap = {
        //     'shareContent':'分享无极限，万元奖金轻松赚。',
        //     'shareTitle':'爱联盟好友邀请',
        //     'sharePic':'http://image.zhbservice.com/upload/17/10/171020144647_555o5.jpg',
        //     'shareUrl':'https://act.zhbservice.com/actSite/views/double11/double11_2.html'
        // };
        if (isIos()) {
            apxInterface.toAppShare(null, null, options);

        } else if (isAndroid() && js2android) {
            var android_share = {
                "title": options.shareTitle,
                "linkUrl": options.shareUrl,
                "picAddr": options.sharePic,
                "detail": options.shareContent,
                "detial": options.shareContent
            };
            js2android.showShareNative(JSON.stringify(android_share)) //{ //{"title":"标题","liinkUrl":"分享链接","picAddr":"","detail":""}
        }
        ;
    },
    // h5跳转到app登录页面 二级页面跳转
    twoGotoAppLogin: function(url) {

        if (isApp()) { //App来

            if (isIos()) { // ios的桥
                apxInterface.login();
            } else if (window.js2android) { // 安卓的桥
                js2android.loginReturn(); // 跳转到android的登录页面
            }
            ;

        } else { // 微网站
            if (url) {
                location.href = zhbh5_host + "wxSite/views/login/login.html?goto=" + encodeURIComponent(url);
                return;
            }
            ;
            location.href = zhbh5_host + "wxSite/views/login/login.html?goto=" + encodeURIComponent(location.href);
        }
        ;
    },
    // 跳转app商品商品详情页
    toAppProductDetail: function(options) {

        if (isApp()) {

            if (isIos()) {

                url_openby('openby:zhbservice={"params":{"productDetailId":"' + (options.productDetailId ? options.productDetailId : '') + '","productId":"' + (options.productId ? options.productId : '') + '"},"action":"go.productDetail"}')
            } else if (isAndroid()) {
                url_openby('openby:zhbservice={"params":{"productDetailId":"' + (options.productDetailId ? options.productDetailId : '') + '","productId":"' + (options.productId ? options.productId : '') + '"},"action":"go.productDetail"}')
            }

        } else { //微网站
         
            if (options.productDetailId) {
                window.location.href = url_host + 'mSite/views/Detail_pages/detail.html?detail=' + options.productDetailId + '&productId=' + options.productId;
                return;
            };
            window.location.href = url_host + 'mSite/views/Detail_pages/detail.html?parentId=' + options.productId;

        }
    },
    gotoAppUrlFormat: (linkUrl) =>{
        if (isApp()) {
            if (linkUrl.indexOf('http') > -1) { //全链接
                window.location.href = linkUrl;
            } else {
                var url_if = '';
                location.href.indexOf('?') > -1 ? url_if = '&' : url_if = '?';

                if (location.href.indexOf(url_if + 'openby:zhbservice') > -1) {
                    window.location.href = location.href.split('openby:zhbservice=')[0] + linkUrl;
                } else {
                    window.location.href = location.href + url_if + linkUrl;
                };
            }

        } else {
            if (linkUrl) {
                var openby = JSON.parse(linkUrl.split('openby:zhbservice=')[1]);
                var action = openby.action;
                if (action == 'go.productDetail') {
                    window.location.href = url_host+ 'mSite/views/Detail_pages/detail.html?parentId=' + openby.params.productId;
                } else if (action == 'go.mobileTopUp') { //手机充值
                    window.location.href = url_host + 'mSite/views/pay/chargeOrder.html'
                } else if (action == 'go.gasolineCardTopUp') { //加油卡
                    window.location.href = url_host + 'mSite/views/pay/fuel_card.html';
                } else if (action == 'go.category') { //分类
                    window.location.href = ''
                } else if (action == 'go.brand') { //名品汇列表页
                    window.location.href = ''
                } else if (action == 'go.selected') { //精选专题
                    window.location.href = ''
                } else if (action == 'go.top') { //每周热销TOP榜
                    window.location.href = ''
                } else if (action == 'go.h5') {
                    window.location.href = openby.params.linkUrl;
                };
            }
        }
    },

}

if (window.location.href.indexOf('#/index') > -1) {
    if (isApp()) {
        if (isIos()) {

            apxInterface.getUserInfo(function(info) {
                appFunc.resetInfo(info, false);
            }, null)

        } else if (isAndroid()) { // 安卓的桥
            var user_info = js2android.getUserInfo();
            // var user_info = eval(user_info);
            user_info = JSON.parse(user_info);

            appFunc.resetInfo(user_info, false);
        }
    } else {
        var pc_user_info = {
            uid: getUrlAttribute('uid'),
            token: getUrlAttribute('token'),
            mobile: getUrlAttribute('mobile')
        }
        appFunc.resetInfo(pc_user_info, false);

        if (getUrlAttribute('refereeMobile')) {
            Cookies.set('refereeMobile', getUrlAttribute('refereeMobile'), {
                path: '/'
            });
        }
    }
}

window.jsToApp = function(uid, token, mobile) {
var info = {
    uid,
    token,
    mobile
}

appFunc.resetInfo(info, true);
}




export default appFunc
