const React = require('react');
const ReactDOM = require('react-dom');
import { Icon, Flex, Toast, Modal, Button, ImagePicker, Checkbox } from 'antd-mobile';
import Cookies from 'js-cookie';
import createHistory from 'history/createHashHistory'

import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
const alert = Modal.alert;

import { AlikeComponent } from '../components/commonComponent';
import './css/evaluate/evaluate.less';

const history = createHistory();



class AlikeListComponent extends React.Component {
    state = {
        goodInfo: JSON.parse(decodeURI(sessionStorage.getItem('alikeList')))
    }
    componentDidMount() {
        document.title = '相似商品';
        console.log(this.state.goodInfo)
    }

    render() {
        return (
            <div className="alikeList-container">
                <AlikeComponent
                    headerParams={{
                        picUrl: this.state.goodInfo.imgUrl,
                        name: this.state.goodInfo.productTitle,
                        subName: this.state.goodInfo.subName,
                        price: this.state.goodInfo.cashPrice,
                        oldPrice: '',
                        productId: this.state.goodInfo.productId
                    }}
                    fetchName="recommonedProduct"
                    fetchParams={{
                        flag: 7,
                        productId: this.state.goodInfo.productId
                    }}
                    oneKey="list"
                />
            </div>
        )
    }
}
export default AlikeListComponent;