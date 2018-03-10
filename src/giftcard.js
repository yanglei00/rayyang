const React = require('react');
const ReactDOM = require('react-dom');

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';
require('es6-promise').polyfill();
require('isomorphic-fetch');


import rem from './app/libs/rem'

// 引入React-Router模块
import { HashRouter } from 'react-router-dom'
import { HashRouter as Router, Route } from 'react-router-dom'


// bundle模型用来异步加载组件
import Bundle from './bundle.js';


// 异步引入
import my from 'bundle-loader?lazy&name=app-[name]!./giftcard/pages/my.js';
import bind from 'bundle-loader?lazy&name=app-[name]!./giftcard/pages/bind.js';
import cardList from 'bundle-loader?lazy&name=app-[name]!./giftcard/pages/cardList.js';


rem();

Date.prototype.format = function(fmt) { //author: meizz   
var o = {
    "M+": this.getMonth() + 1, //月份   
    "d+": this.getDate(), //日   
    "h+": this.getHours(), //小时   
    "m+": this.getMinutes(), //分   
    "s+": this.getSeconds(), //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds() //毫秒   
};
if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
return fmt;
}
//数字格式化
Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
places = !isNaN(places = Math.abs(places)) ? places : 2;
symbol = symbol !== undefined ? symbol : "$";
thousand = thousand || ",";
decimal = decimal || ".";
// console.log(parseInt(this)!=this)
if (parseInt(this) != this) {
    places = 2;

    if( String(this).split('.')[1] ){
        places = String(this).split('.')[1].length;

        if( places > 2 ){
            places = 2;
        }
    }

}
var number = this,
    negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};


const My = () => (
    <Bundle load={my}>
        {(My) => <My />}
    </Bundle>
)
const Bind = () => (
    <Bundle load={bind}>
        {(Bind) => <Bind />}
    </Bundle>
)
const CardList = () => (
    <Bundle load={cardList}>
        {(CardList) => <CardList />}
    </Bundle>
)


class Init extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount() {
        console.log('will')
    }
    render() {
        return (
            <HashRouter>
                <Router basename="/">
                    <div id="app-container">
                        <Route path="/my" component={My} />
                        <Route path="/bind" component={Bind} />
                        <Route path="/cardList" component={CardList} />
                        
                    </div>
                </Router>
            </HashRouter>
        )
    }
    componentDidMount() {}
}


// 配置路由，并将路由注入到id为init的DOM元素中
ReactDOM.render((
    <Init />
    ), document.querySelector('#init'))