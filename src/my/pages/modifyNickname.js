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

class ModifyNicknameComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            defaultValue: ''
        }
    }
    componentWillMount(){
        this.setState({
            defaultValue: commonFn.getUrlAttribute('nickname')
        })
    }
    componentDidMount() {
        document.title = "修改昵称";
    }
    submitFetch = (value) => {
        fetch(api_host + 'zhbService/mobile/modifyNickName', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                nickName: value
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    Toast.info('修改成功', 3, () => {
                        commonFn.history.go(-1);
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
            <div className="nickname-container">
                <List>
                    <InputItem
                        {...getFieldProps('nickname', {
                            initialValue: this.state.defaultValue,
                            rules: [{
                                // required: true,
                                validator: (rule, value, callback) => {
                                    const { validateFields } = this.props.form;
                                    // console.log(value)
                                    if (value) {
                                        let flag = /["'<>%;~@#$^*)(&+]/.exec(value);
                                        if (flag) {
                                            callback('请输入不包含特殊字符的昵称');
                                        }
                                    }
                                    callback();
                                }
                            },]
                        }) }
                        type={'text'}
                        placeholder="请输入昵称"
                        moneyKeyboardAlign="left"
                        maxLength='10'
                        clear
                    ></InputItem>
                </List>
                <Button 
                    className={this.props.form.getFieldValue('nickname')? '': 'gray'}
                    onClick={(e) => {
                        console.log(this.props.form.getFieldValue('nickname'))
                        e.preventDefault();
                        if (e.target.className.indexOf('gray') > -1){return}
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
                            this.submitFetch(values.nickname)
                        });
                }}>保存</Button>
            </div>
        )
    }
}
export default createForm()(ModifyNicknameComponent);