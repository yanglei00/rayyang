const React = require('react');
const ReactDOM = require('react-dom');

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';
require('es6-promise').polyfill();
require('isomorphic-fetch');


import rem from './order/libs/rem'

// 引入React-Router模块
import { HashRouter } from 'react-router-dom'
import { HashRouter as Router, Route } from 'react-router-dom'


// bundle模型用来异步加载组件
import Bundle from './bundle.js';

// 异步引入
import index from 'bundle-loader?lazy&name=order-[name]!./order/pages/index.js';
import invoice from 'bundle-loader?lazy&name=order-[name]!./order/pages/invoice.js';
import logistics from 'bundle-loader?lazy&name=order-[name]!./order/pages/logistics.js';

rem();

const Index = () => (
    <Bundle load={index}>
        {(Index) => <Index />}
    </Bundle>
)
const Invoice = () => (
    <Bundle load={invoice}>
        {(Invoice) => <Invoice />}
    </Bundle>
)
const Logistics = () => (
    <Bundle load={logistics}>
        {(Logistics) => <Logistics />}
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
                        <Route path="/index" component={Index} />
                        <Route exact path="/invoice" component={Invoice} />
                        <Route exact path="/logistics" component={Logistics} />
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