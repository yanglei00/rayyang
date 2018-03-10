const React = require('react');
const ReactDOM = require('react-dom');
import { createForm } from 'rc-form';
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import Cookies from 'js-cookie';
import { Icon, Flex, Toast, Modal, List, Button, InputItem } from 'antd-mobile';
// import { appFunc } from './../libs/appfuncs.js'
import md5 from 'md5';

const alert = Modal.alert;
const Item = List.Item;

import './css/payPassword.less';


class VerifyPayPasswordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isShowPassword1: false,
            isShowPassword2: false,
        }
    }
    componentDidMount() {
        document.title = "验证支付密码";
    }
    submitFetch = (value) => {
        fetch(api_host + 'zhbService/mobile/verifyOriginalPayPassword', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                payPassword: md5(value)
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    commonFn.history.push('/modifyPayPassword')
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
            <div className="verifyPayPassword-container">
                <List>
                    <InputItem
                        {...getFieldProps('password1', {
                            rules: [{
                                required: true,
                                message: '请输入您的原支付密码'
                            }, {
                                validator: (rule, value, callback) => {
                                    const { validateFields } = this.props.form;
                                    // console.log(value)
                                    if (value) {
                                        // let flag = /^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/.exec(value);
                                        // if (!flag) {
                                        //     callback('请输入8-16位数字、字母或符号组合');
                                        // }
                                    }
                                    callback();
                                }
                            }]
                        }) }
                        type={this.state.isShowPassword1 ? 'text' : 'password'}
                        placeholder="请输入您的原支付密码"
                        extra={<img className="eye-logo" src={this.state.isShowPassword1 ? require('./img/password_visible.png') : require('./img/password_hidden.png')} />}
                        onExtraClick={() => {
                            this.setState({
                                isShowPassword1: !this.state.isShowPassword1,
                            })
                        }}
                        moneyKeyboardAlign="left"
                        maxLength="16"
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
                        this.submitFetch(values.password1)
                    });
                }}>确定</Button>
                <div className="forget-btn" onClick={()=>{
                    commonFn.history.push('/verifyPhone')
                }}>忘记支付密码？</div>
            </div>
        )
    }
}
export default createForm()(VerifyPayPasswordComponent);