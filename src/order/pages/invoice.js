const React = require('react');
const ReactDOM = require('react-dom');
import {createForm} from 'rc-form';
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import Cookies from 'js-cookie';
import { Icon, Flex, Toast, Modal, Switch , List, Button, InputItem, Checkbox} from 'antd-mobile';
// import { appFunc } from './../libs/appfuncs.js'
const alert = Modal.alert;
const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
import createHistory from 'history/createHashHistory'
// import default from '../libs/appfuncs.js';

import './css/invoice.less';
const history = createHistory()

class InvoiceComponent extends React.Component {
    constructor(props){
        super(props)
        this.state={
            isShowInvoice: (commonFn.getUrlAttribute('head')?true: false),
            isShowFirstInvoiceHeader: (commonFn.getUrlAttribute('taxId') ? false : true),
        }
    }
    componentDidMount(){
        document.title = '发票信息'
    }
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div className="invoice-container">
                <List>
                    <Item
                        extra={<Switch
                            {...getFieldProps('Switch1', {
                                initialValue: this.state.isShowInvoice,
                                valuePropName: 'checked',
                            }) }
                            onClick={(checked) => { 
                                if(checked){
                                    this.setState({
                                        isShowInvoice: true,
                                    })
                                }else{
                                    this.setState({
                                        isShowInvoice: false,
                                    })
                                }
                            }}
                        />}
                    >
                        是否开具发票
                    </Item>
                </List>
                {this.state.isShowInvoice &&
                    <div>
                        <List className="invoice-header-container">
                            <Item
                                extra={'增值税普通发票（纸质）'}
                            >
                                发票类型
                            </Item>
                            <Item
                                extra={<div className="invoice-header-checkbox">
                                    <Checkbox 
                                        checked={this.state.isShowFirstInvoiceHeader}
                                        onChange={(e)=>{
                                            if (e.target.checked){
                                                this.setState({
                                                    isShowFirstInvoiceHeader: true,
                                                })
                                            }
                                    }}>个人</Checkbox>
                                <Checkbox 
                                    checked={!this.state.isShowFirstInvoiceHeader}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            this.setState({
                                                isShowFirstInvoiceHeader: false,
                                            })
                                        }
                                }}>单位</Checkbox>
                                </div>}
                            >
                                发票抬头
                            </Item>
                        </List>
                        {this.state.isShowFirstInvoiceHeader &&  
                            <List className="invoice-header-content">
                                <InputItem
                                    {...getFieldProps('person', {
                                        initialValue: (commonFn.getUrlAttribute('head') ? commonFn.getUrlAttribute('head'): '个人'),
                                        rules: [{
                                            required: this.state.isShowFirstInvoiceHeader,
                                            message: '请输入发票抬头'
                                        }, {
                                            validator: (rule, value, callback) => {
                                                const { validateFields } = this.props.form;
                                                callback();
                                            }
                                        }]
                                    }) }
                                    type={'text'}
                                    onExtraClick={() => {

                                    }}
                                    moneyKeyboardAlign="left"
                                ></InputItem>
                            </List>
                        }
                        {!this.state.isShowFirstInvoiceHeader &&  
                            <List className="invoice-header-content">
                                <InputItem
                                    {...getFieldProps('company', {
                                            initialValue: (commonFn.getUrlAttribute('head') ? commonFn.getUrlAttribute('head') : ''),
                                            rules: [{
                                                required: !this.state.isShowFirstInvoiceHeader,
                                                message: '请输入发票抬头'
                                            }, {
                                                validator: (rule, value, callback) => {
                                                    const { validateFields } = this.props.form;
                                                    callback();
                                                }
                                            }]
                                        }) }
                                    type={'text'}
                                    placeholder="请输入单位全称"
                                    extra={''}
                                    onExtraClick={() => {

                                    }}
                                    moneyKeyboardAlign="left"
                                ></InputItem>
                                <InputItem
                                    {...getFieldProps('companyId', {
                                        initialValue: (commonFn.getUrlAttribute('head') ? commonFn.getUrlAttribute('taxId') : ''),
                                        rules: [{
                                            required: !this.state.isShowFirstInvoiceHeader,
                                            message: '请输入纳税人识别号'
                                        }, {
                                            validator: (rule, value, callback) => {
                                                const { validateFields } = this.props.form;
                                                callback();
                                            }
                                        }]
                                    }) }
                                    type={'text'}
                                    placeholder="请输入纳税人识别号"
                                    extra={''}
                                    onExtraClick={() => {

                                    }}
                                    moneyKeyboardAlign="left"
                                ></InputItem>
                            </List>
                        }
                        <List>
                            <Item
                                className="right-flex-item"
                                extra={'¥'+(commonFn.getUrlAttribute('payCash')||'0')+'（仅现金支付金额支持开具发票）'}
                            >
                                发票金额
                            </Item>
                            <Item
                                extra={'明细'}
                            >
                                发票内容
                            </Item>
                        </List>
                    </div>
                }
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
                        let invoiceDetail = [{
                            'invoiceType':'1', //1纸质发票  2 电子
                            'content': '4', // 发票内容 1.电脑配件；2.耗材；3.办公用品；4.明细
                            'headType': (this.state.isShowFirstInvoiceHeader?'1':'2'), //发票抬头 1.个人 ；2.公司
                            'head': (values.person || values.company), //发票抬头(如公司名称)
                            'tel': Cookies.get('mobile'), //发票人手机号
                            'email':'' , // 发票人邮箱
                            'taxId': values.companyId||'', // 发票人识别码
                        }]
                        sessionStorage.setItem('invoiceDetail', JSON.stringify(invoiceDetail));
                        setTimeout(function(){ 
                            window.location.href = url_msite +'mSite/views/pay/order_new.html';
                        }, 100);
                    });
                }}>确定</Button>
            </div>
        )
    }
}
export default createForm()(InvoiceComponent);