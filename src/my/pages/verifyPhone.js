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


class VerifyPhoneComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }
    componentDidMount() {
        document.title = "忘记支付密码";
        commonFn.WechatShareDisable();
    }
    submitFetch = (value) => {
        fetch(api_host + 'zhbService/mobile/verifyMobileForPayPassword', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                loginMobile: value,    
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    commonFn.history.push({
                        pathname: '/verifyCard',
                        search: (commonFn.getUrlAttribute('beFrom') == 'maker'?'?beFrom=maker' :'')
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
            <div className="verifyPhone-container">
                <List>
                    <InputItem
                        {...getFieldProps('phone', {
                            rules: [{
                                required: true,
                                message: '请输入11位手机号码'
                            }]
                        }) }
                        type={'text'}
                        placeholder="请输入您的登录手机号码"
                        moneyKeyboardAlign="left"
                        maxLength="11"
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
                        this.submitFetch(values.phone)
                    });
                }}>下一步</Button>
            </div>
        )
    }
}
export default createForm()(VerifyPhoneComponent);