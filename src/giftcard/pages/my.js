const React = require('react');
const ReactDOM = require('react-dom');

import { Tabs,Toast,Flex,WhiteSpace } from 'antd-mobile';
import Cookies from 'js-cookie';
import appFunc from './../libs/appfuncs';


import { NotDataComponent } from '../components/commonComponent';
import commonFn from '../libs/commonfn';
import createHistory from 'history/createHashHistory'
const history = createHistory();


import './css/my.less';




export class ListItem extends React.Component{
    state={
        available:[],
        used:[],
        disable:[],
    }
    componentDidMount(){

    }
    render() {
        let line_data = this.props.data.columns;
        return (
            <div key={line_data.id} className={"card_item "+this.props.type} >
                <img src={require('./img/gift_card.png')} alt="" className="card_bg canused_bg"/>

                <img src={require('./img/disabled_gift_card.png')} alt="" className="card_bg unused_bg"/>

                <img src={require('./img/have_run_out.png')} className="used_icon card_icon" />
                <img src={require('./img/expired.png')} className="expired_icon card_icon" />
                <table className="card_con">
                    <tbody>
                        <tr>
                            <td>
                                <span className="label">
                                    <Flex>
                                        <Flex.Item style={{textAlign: 'left'}}>余</Flex.Item>
                                        <Flex.Item style={{textAlign: 'right'}}>额：</Flex.Item>
                                    </Flex>
                                </span>
                            </td>
                            <td className="right_td"><span className="card_num">&yen;{line_data.surplus_amount}</span></td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="apx_txt">
                                <span>{line_data.card_name}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="label">
                                    <Flex>
                                        <Flex.Item style={{textAlign: 'left'}}>卡</Flex.Item>
                                        <Flex.Item style={{textAlign: 'right'}}>号：</Flex.Item>
                                    </Flex>
                                </span>
                            </td>
                            <td className="right_td"><span>{line_data.card_num}</span></td>
                        </tr>

                        <tr>
                            <td>
                                <span className="label">
                                    有效期：
                                </span>
                            </td>
                            <td className="right_td"><span>{ line_data.endtime?line_data.starttime+'-'+line_data.endtime:'永久有效' }</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}


class My extends React.Component{
    state={
        tabs:[
            { title: '可用', sub: '1' ,id:'take_success_tab'},
            { title: '已用', sub: '2'   ,id:'take_check_tab'},
            { title: '失效', sub: '3' ,id:'take_faile_tab'},
        ],
        btnShow:true,
    }
    componentWillMount () {
        if( appFunc.isIos ){
            appFunc.navigationBarUpdated('我的礼品卡','13');
        }else if( appFunc.isAndroid ){
            appFunc.navigationBarUpdated('我的礼品卡','101');
        }
        
        document.title="我的礼品卡";
        this.setState({
            tokenLoading:true
        })
        fetch(zhbh5_host + 'h5service/token/getNewToken', { //
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            this.setState({
                tokenLoading:false
            })
            Cookies.set('access_token', data.newToken, {
                expires: 3,
                path: '/'
            });

            this.getCardList( data.newToken );
        })



        



        
    }

	componentDidMount () {
       document.title="我的礼品卡";
       appFunc.navigationBarUpdated('我的礼品卡','13');

        window.reloadMyCardPage=()=>{
            this.getCardList(Cookies.get("access_token"));
        }
	}

    getCardUseRule = ( newToken ) => {
        let send_data = {
            access_token: newToken,
        }
        fetch(api_host + 'zhbService/mobile/getCardUseRule ', { //
            method: 'post',
            body: commonFn.urlEncode(send_data),
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            this.setState({
                ruleJson:{
                    title:data.data.cardTitle,
                    content:data.data.useOfRule
                }
            })

        })
    }
    
    getCardList = ( newToken ) =>{

        let send_data = {
            access_token: newToken,
            userId: Cookies.get("uid")
        }

        Toast.loading('加载中', 0);
        fetch(api_host+'zhbService/mobile/myGiftCardList', { //
            body: commonFn.urlEncode(send_data),
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            
            this.setState({
                available:data.data.available,
                used:data.data.used,
                disable:data.data.disable,
                tabs:[
                    { title: '可用 ('+data.data.available.length+')', sub: '1' ,id:'take_success_tab'},
                    { title: '已用 ('+data.data.used.length+')', sub: '2'   ,id:'take_check_tab'},
                    { title: '失效 ('+data.data.disable.length+')', sub: '3' ,id:'take_faile_tab'},
                ],
                buyUrl:data.data.buyUrl,
                title:data.data.buyUrl?data.data.title:'',
                productId:data.data.productId
            },()=>{
                Toast.hide();
            })

        })
    }


	render(){

        return(
            <div className={this.state.btnShow?'my_card_container cash-tabs btnShow':'my_card_container cash-tabs'} >
                <input type="hidden" id="navStyle" value="13"/>
                <Tabs

                  tabs={this.state.tabs}
                  initialPage={this.state.defaultTab?this.state.defaultTab:'0'}
                  renderTab={tab => <span id={tab.id}>{tab.title}</span>}
                  swipeable={false}
                  onChange={(tab, index) => {
                    if( index === 0 ){
                        this.setState({
                            btnShow:true
                        })
                    }else{
                        this.setState({
                            btnShow:false
                        })
                    }
                  }}
                >
                    <div className="trade_list">
                        {(this.state.available && this.state.available.length) ?
                            this.state.available.map((value,key)=>(
                                <ListItem key={key} data={value} type="available"/>
                            )) : <NotDataComponent txt="您暂无可用的礼品卡"/>
                        }

                        <WhiteSpace size="xl" />
                    </div>

                    <div className="trade_list">

                        {(this.state.used && this.state.used.length) ?
                            this.state.used.map((value,key)=>(
                                <ListItem key={key} data={value} type="used_card_item"/>
                            )) : <NotDataComponent txt="您暂无已用的礼品卡"/>
                        }
                        <WhiteSpace size="xl" />

                    </div>

                    <div className="trade_list">

                        {(this.state.disable && this.state.disable.length) ?
                            this.state.disable.map((value,key)=>(
                                <ListItem key={key} data={value} type="expired_card_item"/>
                            )) : <NotDataComponent txt="您暂无失效的礼品卡"/>
                        }
                        <WhiteSpace size="xl" />
                    </div>
                </Tabs>

                <Flex className={'bottom_btns'+(appFunc.is_iphonex?' iphonex':'')} style={{display:this.state.btnShow?'flex':'none'}}>
                    <Flex.Item className="buy_btn" onClick={()=>{
                        if( !this.state.tokenLoading ){
                            if( this.state.buyUrl ){
                                if( appFunc.isIos ){
                                    // appFunc.navigationBarUpdated(this.state.title,'0');
                                    appFunc.oneToTwoWebview( this.state.buyUrl, this.state.title, 'allUrl', 8 );
                                }else if( appFunc.isAndroid ){
                                    window.location.href = this.state.buyUrl+'?title='+this.state.title;
                                    // appFunc.oneToTwoWebview( this.state.buyUrl, this.state.title, 'allUrl', 14 );
                                }else{
                                    // history.push('cardList');
                                    window.location.href = this.state.buyUrl
                                }

                            }else if ( this.state.productId ){
                                appFunc.toAppProductDetail({
                                    productDetailId: '',
                                    productId: this.state.productId
                                })
                            }else{
                                Toast.info('暂无爱品选礼品卡');
                            }
                        }
                        
                    }}>购买礼品卡</Flex.Item>
                    <Flex.Item className="bind_btn" onClick={()=>{
                        appFunc.toBindCard()
                    }}>绑定礼品卡</Flex.Item>
                </Flex>
            </div>
        )
    }
}

export default My



