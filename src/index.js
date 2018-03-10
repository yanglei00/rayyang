const React = require('react');
const ReactDOM = require('react-dom');

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';
require('es6-promise').polyfill();
require('isomorphic-fetch');


import rem from './libs/rem'
import './components/css/common.less';
// 引入React-Router模块
import { HashRouter } from 'react-router-dom'
import { HashRouter as Router, Route } from 'react-router-dom'


// bundle模型用来异步加载组件
import Bundle from './bundle.js';

// 异步引入
import index from 'bundle-loader?lazy&name=index-[name]!./index/pages/index.js';

import choice from 'bundle-loader?lazy&name=app-[name]!./index/pages/choice.js';
import dailyRecent from 'bundle-loader?lazy&name=app-[name]!./index/pages/dailyRecent.js';
import seckill from 'bundle-loader?lazy&name=app-[name]!./index/pages/seckill.js';
import goodsList from 'bundle-loader?lazy&name=index-[name]!./index/pages/goodsList.js';
import category from 'bundle-loader?lazy&name=index-[name]!./index/pages/category.js';
import categoryGoodsList from 'bundle-loader?lazy&name=index-[name]!./index/pages/categoryGoodsList.js';
import search from 'bundle-loader?lazy&name=index-[name]!./index/pages/search.js';
import buyerOrderList from 'bundle-loader?lazy&name=index-[name]!./index/pages/buyerOrderList.js';
import buyerOrderDetail from 'bundle-loader?lazy&name=index-[name]!./index/pages/buyerOrderDetail.js';
import lifeService from 'bundle-loader?lazy&name=index-[name]!./index/pages/lifeService.js';
import test from 'bundle-loader?lazy&name=index-[name]!./index/pages/test.js';
rem();

Date.prototype.format = function(fmt) { //author: meizz   
var o = {
    "M+": this.getMonth() + 1, // 月份   
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

    if (String(this).split('.')[1]) {
        places = String(this).split('.')[1].length;

        if (places > 2) {
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

//首页
const Index = () => (
    <Bundle load={index}>
        {(Index) => <Index />}
    </Bundle>
)
const Choice = () => (
    <Bundle load={choice}>
        {(Choice) => <Choice />}
    </Bundle>
)
const DailyRecent = () => (
    <Bundle load={dailyRecent}>
        {(DailyRecent) => <DailyRecent />}
    </Bundle>
)
const Seckill = () => (
    <Bundle load={seckill}>
        {(Seckill) => <Seckill />}
    </Bundle>
)
const GoodsList = () => (
    <Bundle load={goodsList}>
        {(GoodsList) => <GoodsList />}
    </Bundle>
)
const Category = () => (
    <Bundle load={category}>
        {(Category) => <Category />}
    </Bundle>
)
const CategoryGoodsList = () => (
    <Bundle load={categoryGoodsList}>
        {(CategoryGoodsList) => <CategoryGoodsList />}
    </Bundle>
)
const Search = () => (
    <Bundle load={search}>
        {(Search) => <Search />}
    </Bundle>
)
const Test = () => (
    <Bundle load={test}>
        {(Test) => <Test />}
    </Bundle>
)
const BuyerOrderList = () => (
    <Bundle load={buyerOrderList}>
        {(BuyerOrderList) => <BuyerOrderList />}
    </Bundle>
)

const BuyerOrderDetail = () => (
    <Bundle load={buyerOrderDetail}>
        {(BuyerOrderDetail) => <BuyerOrderDetail />}
    </Bundle>
)

const LifeService = () => (
    <Bundle load={lifeService}>
        {(LifeService) => <LifeService />}
    </Bundle>
)
const Activity = () => (
    <Bundle load={activity}>
        {(Activity) => <Activity />}
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
                    <div id="app-container" style={{
                height: '100%'
            }}>
                        <Route path="/index" component={Index} />

                        <Route path="/choice" component={Choice} />
                         <Route path="/dailyRecent" component={DailyRecent} />
                         <Route path="/seckill" component={Seckill} />
                        <Route path="/goodsList" component={GoodsList} />
                        <Route path="/category" component={Category} />
                        <Route path="/categoryGoodsList" component={CategoryGoodsList} />
                        <Route path="/search" component={Search} />
                        <Route path="/buyerOrderList" component={BuyerOrderList} />
                        <Route path="/buyerOrderDetail" component={BuyerOrderDetail} />
                        <Route path="/lifeService" component={LifeService} />
                        <Route path="/activity" component={Activity} />
                        <Route path="/test" component={Test} />
                        
                        
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