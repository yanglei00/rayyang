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

import './css/payPassword.less';


class VerifyCardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isShowPassword1: false,
            isShowPassword2: false,
        }
    }
    componentDidMount() {
        document.title = "身份验证";
    }
    submitFetch = (value) => {
        fetch(api_host + 'zhbService/mobile/authenticationForPayPassword', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                identityNumber: value || 0,
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    commonFn.history.push({
                        pathname: '/findPayPassword',
                        search: (commonFn.getUrlAttribute('beFrom') == 'maker' ? '?beFrom=maker' : '')
                    })
                } else {
                    Toast.info(rs.errorMessage)
                }
            })
            .catch((err) => {
                console.log(err)
                // commonFn.getNewToken({
                //     uid: Cookies.get('uid'),
                // }, (rs) => {
                //     this.initFetch();
                // });
            })
    }
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div className="verifyCard-container">
                <div className="tip">为了您的账户安全，请先进行身份验证。</div>
                <div className="verifyCard-content">
                    <List>
                        <InputItem
                            {...getFieldProps('card', {
                                rules: []
                            }) }
                            type={'text'}
                            placeholder="请输入您的实名认证证件号码"
                            moneyKeyboardAlign="left"
                        ></InputItem>
                    </List>
                    <Button onClick={(e) => {
                        e.preventDefault();
                        this.props.form.validateFields((errors, values) => {
                            if (!!errors) {
                                console.log('Errors in form!!!');
                                for (let key in errors) {
                                    if (errors[key].errors[0].message) {
                                        Toast.info(errors[key].errors[0].message);
                                        break;
                                    }
                                }
                                return;
                            }
                            console.log('Submit!!!');
                            console.log(values);
                            this.submitFetch(values.card)
                        });
                    }}>下一步</Button>
                </div>
            </div>
        )
    }
}
export default createForm()(VerifyCardComponent);