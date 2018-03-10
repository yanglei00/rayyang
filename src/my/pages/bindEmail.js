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


class BindEmailComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }
    componentDidMount() {
        document.title = "绑定邮箱";
    }
    submitFetch = (value) => {
        fetch(api_host + 'zhbService/mobile/zhbEmail/sendEmail', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                email: value,
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    alert(<span>请登录邮箱点击激活链接<br />完成邮箱绑定</span>, '', [{text: '知道了',onPress:()=>{
                        commonFn.history.goBack();
                    }}])
                } else {
                    Toast.info(rs.errorMessage)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div className="bindEmail-container">
                <List>
                    <InputItem
                        {...getFieldProps('email', {
                            rules: [{
                                required: true,
                                message: '邮箱号码格式不正确'
                            }, {
                                validator: (rule, value, callback) => {
                                    const { validateFields } = this.props.form;
                                    // console.log(value)
                                    if (value) {
                                        let flag = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.exec(value);
                                        if (!flag) {
                                            callback('邮箱号码格式不正确');
                                        }
                                    }
                                    callback();
                                }
                            }]
                        }) }
                        type={'email'}
                        placeholder="请输入邮箱"
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
                        this.submitFetch(values.email)
                    });
                }}>确定</Button>
            </div>
        )
    }
}
export default createForm()(BindEmailComponent);