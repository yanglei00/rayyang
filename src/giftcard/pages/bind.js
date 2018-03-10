const React = require('react');

import { Button,InputItem,Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import Cookies from 'js-cookie';
import appFunc from './../libs/appfuncs';


import './css/my.less';


class Bind extends React.Component{
    state={
        disabled:true
    }
    
    componentWillMount () {
        appFunc.navigationBarUpdated('绑定礼品卡','13');
        document.title="绑定礼品卡";
    }

	componentDidMount () {
       
	}
    checknum = (value) => {
        var Regx = /^[A-Za-z0-9]*$/;
        if (Regx.test(value)) {
            return true;
        }else {
            return false;
        }
    }
    validateAccount = (rule, value_form, callback) => {
        let value = value_form.replace(/\s/g,"");
        
        if (value && value.length) {
            if ( value.length !== 16) {
                Toast.info('请输入16位礼品卡密码');
                callback(new Error('请输入16位礼品卡密码'));
            } else if ( !this.checknum(value) ) {
                Toast.info('请输入正确格式的礼品卡密码');
                callback(new Error('请输入正确格式的礼品卡密码'));
            } else {
                this.setState({
                    disabled:false
                })
                callback();
            }
        } else {
            callback(new Error('请输入礼品卡密码'));
        }
    }
    toBind = () => {
        
        this.props.form.validateFields(['bindInput'], (err, values) => {
            if (err) {
                Toast.info(err.bindInput.errors[0].message, 2, null, false);
            } else {
                if (this.state.isHasSetPassword) {

                    this.checkCanPay(values.bindInput);

                } else {
                    this.beforeGetCash(true, values.bindInput)
                }
            }
        })
    }

	render(){
        const {getFieldProps, getFieldError,setFieldsValue} = this.props.form;

        return(
            <div className="bind_container">
                <InputItem
                    className="gift_input"
                    id='code'
                    placeholder="请输入爱品选礼品卡密码（不区分大小写）"
                    maxLength={19}
                    onInput={(v) => {

                        let value = v.target.value.replace(/\s/g, '').replace(/(....)(?=.)/g, '$1 ');
                        setTimeout(()=>{
                            this.props.form.setFieldsValue({
                                bindInput: value
                            })

                            if (value && value.length) {
                                if ( value.length === 19) {
                                    this.setState({
                                        disabled:false
                                    })
                                    console.log(value.length)
                                } else {
                                    this.setState({
                                        disabled:true
                                    })
                                }
                            } else {
                                this.setState({
                                    disabled:true
                                })
                            }

                        },10)

                    }}
                    {...getFieldProps('bindInput', {
                        validate: [{
                            trigger: ['onBlur'],
                            rules: [
                                {
                                    required: true,
                                    message: '请输入礼品卡密码'
                                },
                                {
                                    validator: this.validateAccount
                                }
                            ],
                        }]
                    })}
                />

                <Button type="primary" disabled={this.state.disabled}  className="bindBtn" onClick={this.toBind}>立即绑定</Button>


            </div>
        )
    }
}


export default createForm()(Bind);



