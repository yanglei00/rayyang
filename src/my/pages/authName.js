const React = require('react');
const ReactDOM = require('react-dom');
import { createForm } from 'rc-form';
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import Cookies from 'js-cookie';
import { Icon, Flex, Toast, Modal, List, Button, InputItem } from 'antd-mobile';
// import { appFunc } from './../libs/appfuncs.js'

const alert = Modal.alert;
const Item = List.Item;

import './css/authName.less';


class AuthNameComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: null,
        }
    }
    componentDidMount() {
        document.title = "实名认证";
    }
    
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div className="authName-container">
                <List>
                    <Item extra={decodeURI(commonFn.getUrlAttribute('realName'))}>真实姓名</Item>
                    <Item extra={commonFn.getUrlAttribute('cardNumber') ? commonFn.getUrlAttribute('cardNumber').replace(/([0-9a-zA-Z]{6})[0-9a-zA-Z]{8}([0-9a-zA-Z]{4})/, '$1********$2'): ''}>身份证号</Item>
                </List>
            </div>
        )
    }
}
export default createForm()(AuthNameComponent);