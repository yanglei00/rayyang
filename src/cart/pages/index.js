const React = require('react');
const ReactDOM = require('react-dom');
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import Cookies from 'js-cookie';
import { Icon, Flex, Toast, Modal, Carousel, PullToRefresh } from 'antd-mobile';
// import { appFunc } from './../libs/appfuncs.js'
const alert = Modal.alert;

import createHistory from 'history/createHashHistory'
// import default from '../libs/appfuncs.js';

const history = createHistory()

class IndexComponent extends React.Component {
    render() {
        return (
            <div>index</div>
        )
    }
}
export default IndexComponent;