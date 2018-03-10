const React = require('react');
const ReactDOM = require('react-dom');
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import Cookies from 'js-cookie';
import { Icon, Flex, Toast, Modal, List, Button} from 'antd-mobile';
// import { appFunc } from './../libs/appfuncs.js'
const alert = Modal.alert;
const Item = List.Item;
import {ShareMaskComponent } from '../components/commonComponent';

import './css/myAccount.less';

class MyAccountComponent extends React.Component {
    constructor(props){
        super(props);
        this.state={
            data: null,
        }
    }
    componentDidMount(){
        document.title="账户管理";
        this.initFetch();
        commonFn.WechatShareDisable();
    }
    initFetch = () => {
        fetch(api_host + 'zhbService/mobile/accountManagement', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    this.setState({
                        data: rs.data,
                    })
                } else {
                    Toast.info(rs.errorMessage)
                }
            })
            .catch((err) => {
                console.log(err)
                if (Cookies.get('uid')){
                    commonFn.getNewToken({
                        uid: Cookies.get('uid'),
                    }, (rs) => {
                        this.initFetch();
                    });
                }
            })
    }
    uploadFetch = (e) => {
        e.persist();
        
        // 上传图片接口
        let file = e.target.files[0]; // 获取文件对象
        let formData = new FormData();
        // var $Blob = commonFn.dataURLtoBlob(reader.result);
        formData.append("uid", Cookies.get('uid'));
        formData.append("fieldName", file, 'avatar.png');
        formData.append("access_token", Cookies.get('access_token')); //
        fetch(api_host + 'zhbService/mobile/uploadimg', {
            method: 'POST', 
            body: formData,
        })
        .then((rs) => {
            return rs.json();
        })
        .then((rs) => {
            if (rs.errorCode == 0) {
                this.setState({
                    data:Object.assign({}, this.state.data, {
                        userPic: rs.data
                    })
                })
            }
        })
        .catch((err) => {
            console.log(err)
            commonFn.getNewToken({
                uid: Cookies.get('uid'),
            }, (rs) => {
                console.log(rs)
                this.uploadFetch(e);
            });
        })
    }
    render() {
        const o = this.state.data;
        return (
            o?(
                <div className="myAccount-container">
                    <List className="myAccount-userInfo">
                        <Item 
                            className="headLogo"
                            arrow="horizontal"  
                            extra={<img className="headLogo" src={o.userPic?o.userPic:require('./img/header.png')}/>} 
                            onClick={() => { }}>
                            头像
                            <input type="file" className="upload" accept="image/*" onChange={(e)=>{
                                this.uploadFetch(e);
                            }}/>
                        </Item>
                        <Item
                            arrow="horizontal"
                            extra={o.nickName} 
                            onClick={() => { 
                                commonFn.history.push({
                                    pathname: '/modifyNickname',
                                    search: '?nickname='+o.nickName
                                });
                            }}
                        >
                            昵称
                        </Item>
                        <Item
                            extra={o.sex == 1 ? '男' : (o.sex && o.sex == 0 ? '女': '')}
                        >
                            性别
                        </Item>
                        <Item
                            extra={commonFn.encryptPhone(o.mobile)}
                        >
                            登录名
                        </Item>
                        <Item
                            arrow="horizontal"
                            extra={o.email ? o.email : <span className="light-color">立即绑定</span>}
                            onClick={() => { 
                                // if(!o.email){
                                //     window.location.href = url_host + 'mSite/views/myAccount/emailBind.html';
                                // }
                                commonFn.history.push('/bindEmail');
                            }}
                        >
                            绑定邮箱
                        </Item>
                    </List>
                    <List className="myAccount-password">
                        <Item 
                            arrow="horizontal"
                            onClick={()=>{
                                // window.location.href = url_host + 'mSite/views/myAccount/surePass.html?editPass';
                                commonFn.history.push('/verifyPassword')
                            }}
                        >
                            修改登录密码
                        </Item>
                        <Item 
                            arrow="horizontal"
                            extra={o.isSetPayPassword == 1 ? <span className="light-color">修改密码</span>: <span className="light-color">立即设置</span> }
                            onClick={()=>{
                                if (o.isSetPayPassword == 1){
                                    commonFn.history.push('/verifyPayPassword');
                                }else{ // 未设置
                                    if (o.isVerify == 1){
                                        commonFn.history.push('/setPayPassword');
                                    }else{
                                        alert('请先进行实名认证', '', [{ text: '取消' }, { text: '去实名认证', onPress: ()=>{
                                            window.location.href = url_host +'mSite/views/myAccount/authName.html';
                                        }}])
                                    }
                                }
                            }}
                        >
                            支付密码
                        </Item>
                    </List>
                    <List className="myAccount-verify">
                        <Item
                            arrow="horizontal"
                            extra={o.isVerify == 1 ? o.realName : <span className="light-color">立即认证</span>}
                            onClick={()=>{
                                if (o.isVerify ==1 ) {
                                    commonFn.history.push({
                                        pathname: '/authName',
                                        search: '?realName=' + encodeURI(o.realName) +'&cardNumber='+o.cardNumber
                                    })
                                } else {
                                    window.location.href = url_host + 'mSite/views/myAccount/authName.html';
                                }
                            }}
                        >
                            实名认证
                        </Item>
                    </List>
                    <List className="myAccount-address">
                        <Item
                            arrow="horizontal"
                            onClick={()=>{
                                window.location.href = url_host+'mSite/views/order/address.html?from=myAccount'
                            }}
                        >
                            收货地址
                        </Item>
                    </List>
                    {sessionStorage.getItem('bindStatusJudge') != 'yes' &&
                        <Button className="exit-btn" onClick={()=>{
                            alert('您确认退出当前账号吗？', '', [{text: '取消'}, {text: '确认', onPress: ()=>{
                                Cookies.remove('uid');
                                Cookies.remove('mobile');
                                Cookies.remove('access_token');
                                Cookies.remove('authName_token');
                                window.location.href = url_host+ 'mSite/views/index/index.html';
                            }}])
                        }}>退出登录</Button>
                    }
                </div>
            ):(null)
        )
    }
}
export default MyAccountComponent;