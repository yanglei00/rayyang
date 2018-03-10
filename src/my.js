const React = require('react');
const ReactDOM = require('react-dom');

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';
require('es6-promise').polyfill();
require('isomorphic-fetch');



// 引入React-Router模块
import { HashRouter } from 'react-router-dom'
import { HashRouter as Router, Route } from 'react-router-dom'


// bundle模型用来异步加载组件
import Bundle from './bundle.js';

// 异步引入
import my from 'bundle-loader?lazy&name=my-[name]!./my/pages/history.js';
import myAccount from 'bundle-loader?lazy&name=myAccount-[name]!./my/pages/myAccount.js';
import modifyNickname from 'bundle-loader?lazy&name=modifyNickname-[name]!./my/pages/modifyNickname.js';
import bindEmail from 'bundle-loader?lazy&name=bindEmail-[name]!./my/pages/bindEmail.js';
import verifyPassword from 'bundle-loader?lazy&name=verifyPassword-[name]!./my/pages/verifyPassword.js';
import modifyPassword from 'bundle-loader?lazy&name=modifyPassword-[name]!./my/pages/modifyPassword.js';
import setPayPassword from 'bundle-loader?lazy&name=setPayPassword-[name]!./my/pages/setPayPassword.js';
import modifyPayPassword from 'bundle-loader?lazy&name=modifyPayPassword-[name]!./my/pages/modifyPayPassword.js';
import verifyPayPassword from 'bundle-loader?lazy&name=verifyPayPassword-[name]!./my/pages/verifyPayPassword.js';
import verifyPhone from 'bundle-loader?lazy&name=verifyPhone-[name]!./my/pages/verifyPhone.js';
import verifyCard from 'bundle-loader?lazy&name=verifyCard-[name]!./my/pages/verifyCard.js';
import findPayPassword from 'bundle-loader?lazy&name=findPayPassword-[name]!./my/pages/findPayPassword.js';
import authName from 'bundle-loader?lazy&name=authName-[name]!./my/pages/authName.js';
import test from 'bundle-loader?lazy&name=my-[name]!./my/pages/test.js';

import rem from './my/libs/rem'
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
const MyAccount = () => (
    <Bundle load={myAccount}>
        {(MyAccount) => <MyAccount />}
    </Bundle>
)
const VerifyPassword = () => (
    <Bundle load={verifyPassword}>
        {(VerifyPassword) => <VerifyPassword />}
    </Bundle>
)
const ModifyPassword = () => (
    <Bundle load={modifyPassword}>
        {(ModifyPassword) => <ModifyPassword />}
    </Bundle>
)
const ModifyNickname = () => (
    <Bundle load={modifyNickname}>
        {(ModifyNickname) => <ModifyNickname />}
    </Bundle>
)
const BindEmail = () => (
    <Bundle load={bindEmail}>
        {(BindEmail) => <BindEmail />}
    </Bundle>
)
const SetPayPassword = () => (
    <Bundle load={setPayPassword}>
        {(SetPayPassword) => <SetPayPassword />}
    </Bundle>
)
const ModifyPayPassword = () => (
    <Bundle load={modifyPayPassword}>
        {(ModifyPayPassword) => <ModifyPayPassword />}
    </Bundle>
)
const VerifyPayPassword = () => (
    <Bundle load={verifyPayPassword}>
        {(VerifyPayPassword) => <VerifyPayPassword />}
    </Bundle>
)
const VerifyPhone = () => (
    <Bundle load={verifyPhone}>
        {(VerifyPhone) => <VerifyPhone />}
    </Bundle>
)
const VerifyCard = () => (
    <Bundle load={verifyCard}>
        {(VerifyCard) => <VerifyCard />}
    </Bundle>
)
const FindPayPassword = () => (
    <Bundle load={findPayPassword}>
        {(FindPayPassword) => <FindPayPassword />}
    </Bundle>
)
const AuthName = () => (
    <Bundle load={authName}>
        {(AuthName) => <AuthName />}
    </Bundle>
)
const Test = () => (
    <Bundle load={test}>
        {(Test) => <Test />}
    </Bundle>
)
class Init extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount() {
        // console.log('will')
    }
    render() {
        return (
            <HashRouter>
                <Router basename="/">
                    <div id="my-container">
                        {/* <Route exact path="/history" component={My} /> */}
                        <Route exact path="/myAccount" component={MyAccount} />
                        <Route exact path="/modifyNickname" component={ModifyNickname} />
                        <Route exact path="/bindEmail" component={BindEmail} />
                        <Route exact path="/verifyPassword" component={VerifyPassword} />
                        <Route exact path="/modifyPassword" component={ModifyPassword} />
                        <Route exact path="/setPayPassword" component={SetPayPassword} />
                        <Route exact path="/modifyPayPassword" component={ModifyPayPassword} />
                        <Route exact path="/verifyPayPassword" component={VerifyPayPassword} />
                        <Route exact path="/verifyPhone" component={VerifyPhone} />
                        <Route exact path="/verifyCard" component={VerifyCard} />
                        <Route exact path="/findPayPassword" component={FindPayPassword} />
                        <Route exact path="/authName" component={AuthName} />
                        {/* <Route exact path="/test" component={Test} /> */}
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