const React = require('react');
const ReactDOM = require('react-dom');
import { createForm } from 'rc-form';
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import Cookies from 'js-cookie';
import md5 from 'md5';
import { Icon, Flex, Toast, Modal, List, Button, InputItem } from 'antd-mobile';
// import { appFunc } from './../libs/appfuncs.js'
const alert = Modal.alert;
const Item = List.Item;
import { ImgCodeComponent, MessageCodeComponent } from '../components/commonComponent';
import './css/payPassword.less';

class FindPayPasswordComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isShowPassword1: false,
            isShowPassword2: false,
            sendCodeParams: {
                "mobile": Cookies.get('mobile'),
                "gerCode": '',
                "alphanumeric": '',
            },
        }
    }
    componentDidMount() {
        document.title = "找回支付密码";
    }
    submitFetch = (values) => {
        fetch(api_host + 'zhbService/mobile/resetPayPassword', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                phoneCode: values.messageCode,
                mobile: Cookies.get('mobile'),
                payPassword: md5(values.password1)
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    Toast.info('设置成功', 3, ()=>{
                        if (commonFn.getUrlAttribute('beFrom') == 'maker') {
                            window.location.href = url_host + 'makerSite/app.html#/takeMoney';
                        } else {
                            commonFn.history.push('/myAccount')
                        }
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
                        {...getFieldProps('imgCode', {
                            rules: [{
                                required: true,
                                message: '请输入图片验证码'
                            }, {
                                validator: (rule, value, callback) => {
                                    const { validateFields } = this.props.form;
                                    if (value) {
                                        // let flag = /^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/.exec(value);
                                        // if (!flag) {
                                        //     callback('请输入8-16位数字、字母或符号组合');
                                        // }
                                        console.log(value)
                                        this.setState({
                                            sendCodeParams: Object.assign({}, this.state.sendCodeParams, {
                                                gerCode: value
                                            })
                                        })
                                    }
                                    callback();
                                }
                            }]
                        }) }
                        type={'text'}
                        placeholder="请输入图片验证码"
                        extra={<ImgCodeComponent getData={(rs)=>{
                            console.log(rs)
                            this.setState({
                                sendCodeParams: Object.assign({}, this.state.sendCodeParams, {
                                    alphanumeric: rs.alphanumeric
                                })
                            })
                        }}/>}
                        onExtraClick={() => {
                            
                        }}
                        moneyKeyboardAlign="left"
                    ></InputItem>
                    <InputItem
                        {...getFieldProps('messageCode', {
                            rules: [{
                                required: true,
                                message: '请输入短信验证码'
                            }, {
                                validator: (rule, value, callback) => {
                                    const { validateFields } = this.props.form;
                                    // console.log(value)
                                    // if (value) {
                                    //     let flag = /^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/.exec(value);
                                    //     if (!flag) {
                                    //         callback('请输入8-16位数字、字母或符号组合');
                                    //     }
                                    // }
                                    callback();
                                }
                            }]
                        }) }
                        type={'text'}
                        placeholder="请输入短信验证码"
                        extra={<MessageCodeComponent sendCodeParams={this.state.sendCodeParams}
                            onClick={(rs)=>{
                                console.log(rs)
                                if(rs.errorCode == 0){
                                    // this.setState({
                                    //     restTime: this.state.restTime - 1
                                    // })
                                    // var timer = setInterval(() => {
                                    //     this.setState({
                                    //         restTime: this.state.restTime - 1
                                    //     }, () => {
                                    //         if (this.state.restTime === 0) {
                                    //             clearInterval(timer)
                                    //             this.setState({
                                    //                 restTime: 60
                                    //             })
                                    //         }
                                    //     })
                                    // }, 1000)
                                    // Toast.info('短信验证码发送成功', 3, null, false)
                                }else{
                                    Toast.info(rs.errorMessage)
                                }
                            }}
                        />}
                        moneyKeyboardAlign="left"
                    ></InputItem>
                    <InputItem
                        {...getFieldProps('password1', {
                            rules: [{
                                required: true,
                                message: '请输入新密码'
                            }, {
                                validator: (rule, value, callback) => {
                                    const { validateFields } = this.props.form;
                                    // console.log(value)
                                    if (value) {
                                        let flag = /^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/.exec(value);
                                        if (!flag) {
                                            callback('请输入8-16位数字、字母或符号组合');
                                        }
                                    }
                                    callback();
                                }
                            }]
                        }) }
                        type={this.state.isShowPassword1 ? 'text' : 'password'}
                        placeholder="请输入新支付密码"
                        extra={<img className="eye-logo" src={this.state.isShowPassword1 ? require('./img/password_visible.png') : require('./img/password_hidden.png')} />}
                        onExtraClick={() => {
                            this.setState({
                                isShowPassword1: !this.state.isShowPassword1,
                            })
                        }}
                        moneyKeyboardAlign="left"
                        maxLength="16"
                    ></InputItem>
                    <InputItem
                        {...getFieldProps('password2', {
                            rules: [{
                                required: true,
                                message: '请输入确认密码'
                            }, {
                                validator: (rule, value, callback) => {
                                    const { getFieldValue } = this.props.form;
                                    if (value && value !== getFieldValue('password1')) {
                                        callback('两次输入密码不一致！');
                                    } else {
                                        callback();
                                    }
                                }
                            }]
                        }) }
                        type={this.state.isShowPassword2 ? 'text' : 'password'}
                        placeholder="请确认新支付密码"
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
                        this.submitFetch(values)
                    });
                }}>确定</Button>
            </div>
        )
    }
}
export default createForm()(FindPayPasswordComponent);