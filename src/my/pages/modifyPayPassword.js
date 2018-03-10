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

class ModifyPayPasswordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isShowPassword1: false,
            isShowPassword2: false,
        }
    }
    componentDidMount() {
        document.title = "修改支付密码";

    }
    submitFetch = (value) => {
        fetch(api_host + 'zhbService/mobile/modifyPayPassword', {
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
                    Toast.info('修改成功', 3, ()=>{
                        commonFn.history.go(-2);
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
            <div className="payPassword-container">
                <List>
                    <InputItem
                        {...getFieldProps('password1', {
                            rules: [{
                                required: true,
                                message: '请输入新密码'
                            },{
                                validator: (rule, value, callback) => {
                                    const { validateFields } = this.props.form;
                                    // console.log(value)
                                    if (value) {
                                        let flag = /^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/.exec(value);
                                        if(!flag){
                                            callback('请输入8-16位数字、字母或符号组合');
                                        }
                                    }
                                    callback();
                                }
                            }]
                        }) }
                        type={this.state.isShowPassword1? 'text':'password'}
                        placeholder="8-16位数字、字母或符号组合"
                        extra={<img className="eye-logo" src={this.state.isShowPassword1 ? require('./img/password_visible.png') : require('./img/password_hidden.png')}/>}
                        onExtraClick={()=>{
                            this.setState({
                                isShowPassword1: !this.state.isShowPassword1,
                            })
                        }}
                        moneyKeyboardAlign="left"
                        maxLength="16"
                    ></InputItem>
                    <InputItem
                        {...getFieldProps('password2',{
                            rules: [{
                                required: true,
                                message: '请输入确认密码'
                            },{
                                validator: (rule, value, callback) => {
                                    const { getFieldValue } = this.props.form;
                                    if (value && value !== getFieldValue('password1')) {
                                        callback('两次输入密码不一致');
                                    } else {
                                        callback();
                                    }
                                }
                            }]
                        }) }
                        type={this.state.isShowPassword2 ? 'text' : 'password'}
                        placeholder="请输入新支付密码"
                        extra={<img className="eye-logo" src={this.state.isShowPassword2 ? require('./img/password_visible.png') : require('./img/password_hidden.png')} />}
                        onExtraClick={() => {
                            this.setState({
                                isShowPassword2: !this.state.isShowPassword2,
                            })
                        }}
                        moneyKeyboardAlign="left"
                        maxLength="16"
                    ></InputItem>
                </List>
                <Button onClick={(e)=>{
                    e.preventDefault();
                    this.props.form.validateFields((errors, values) => {
                        if (!!errors) {
                            console.log('Errors in form!!!');
                            for(let key in errors){
                                if (errors[key].errors[0].message){
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
            </div>
        )
    }
}
export default createForm()(ModifyPayPasswordComponent);