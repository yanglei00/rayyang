import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, Button, Checkbox } from 'antd-mobile';
import Cookies from 'js-cookie';
import '../libs/swiper-3.4.2.min.js';
import '../pages/css/lib/swiper-3.4.2.min.css';
import NativeShare from 'nativeshare';

import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import './css/commonComponent.less';

import moment from 'moment';


// 上拉刷新组件 
export class PullToRefreshComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            down: false,
            height: document.documentElement.clientHeight,
            data: [],
        };
    }
    genData() {
        const dataArr = [];
        for (let i = 0; i < 20; i++) {
            dataArr.push(i);
        }
        return dataArr;
    }
    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei,
            data: this.genData(),
        }), 0);
    }

    render() {
        return (<div className="pullToRefresh-container">
            <PullToRefresh
                ref={el => this.ptr = el}
                style={{
                    height: this.state.height,
                    overflow: 'auto',
                }}
                indicator={{ deactivate: '上拉可以刷新', finish: '上拉加载更多' }}
                direction={this.state.down ? 'down' : 'up'}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                    this.setState({ refreshing: true });
                    setTimeout(() => {
                        this.setState({ refreshing: false });
                    }, 1000);
                }}
            >
                {this.state.data.map(i => (
                    <div key={i} style={{ textAlign: 'center', padding: 20 }}>
                        {this.state.down ? 'pull down' : 'pull up'} {i}
                    </div>
                ))}
            </PullToRefresh>
        </div>);
    }
}

// 猜你喜欢列表
export class MaybeYouLoveComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            down: false,
            height: document.documentElement.clientHeight,
            bannerList: [],
            list: [],
            pageIndex: 1,
            hasData: true,
        };
    }
    genData() {
        fetch(api_host + 'zhbService/mobile/maybeYouLove', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                flag: (this.props.flag ? this.props.flag :4), //为你推荐3  猜你喜欢4
                pageIndex: this.state.pageIndex,
                pageSize: 20,
                version: '3.0.0',
                platform: 'WeChat',
            }),
        }).then((rs) => {
            if (rs.status == 401) {
                commonFn.getNewToken({
                    uid: Cookies.get('uid'),
                }, (rs) => {
                    this.initFetch();
                });
            }
            return rs.json();
        })
        .then((rs) => {
            if (rs.errorCode == 0) {
                this.setState({
                    bannerList: rs.data.bannerList,
                    refreshing: false
                },()=>{
                    if (rs.data.productInfo.list && rs.data.productInfo.list.length > 0){
                        this.setState({
                            list: this.state.list.concat(rs.data.productInfo.list),
                            pageIndex: (this.state.pageIndex+1),
                            hasData: true,
                        })
                    }else{
                        this.setState({
                            hasData: false
                        })
                    }
                    let mySwiper = new Swiper('#maybeYouLove-list-banner-swiper', {
                        direction: 'horizontal',
                        loop: (rs.data.bannerList.length > 1 ? true : false),
                        pagination: (rs.data.bannerList.length > 1 ? '.swiper-pagination' : ''),
                    })
                })
            } else {
                Toast.info(rs.errorMessage)
            }
        })
        .catch((err) => {
            console.log(err)
            commonFn.getNewToken({
                uid: Cookies.get('uid'),
            }, (rs) => {
                this.genData();
            });
        })
    }
    componentDidMount() {
        this.genData();
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei,
        }), 0);
    }

    render() {
        return (<div className="pullToRefresh-container">
            <PullToRefresh
                ref={el => this.ptr = el}
                style={{
                    height: this.state.height,
                    overflow: 'auto',
                }}
                indicator={{ deactivate: '上拉可以刷新', finish: '上拉加载更多' }}
                direction={this.state.down ? 'down' : 'up'}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                    if(this.state.hasData){
                        this.setState({ refreshing: true }, ()=>{
                            this.genData();
                        });
                    }else{
                        return false
                    }
                }}
            >
                <div className="maybeYouLove-list-container">
                    <div className="maybeYouLove-list-top">
                        <div className="maybeYouLove-list-logo">
                            <img src={this.props.logoUrl} />
                        </div>
                        <p className="maybeYouLove-list-text">{this.props.text}</p>
                    </div>
                    <div className="maybeYouLove-list-content">
                            { this.state.bannerList && this.state.bannerList.length > 0 &&
                                <div className="maybeYouLove-list-banner">
                                    <div className="swiper-container" id="maybeYouLove-list-banner-swiper">
                                        <div className="swiper-wrapper">
                                        {this.state.bannerList.map((o, i)=>{
                                            return (
                                                <div className="swiper-slide" key={i} onClick={()=>{
                                                    appFunc.gotoAppUrlFormat(o.linkUrl);
                                                }}>
                                                    <a className="maybeYouLove-list-banner-swiper-img" >
                                                        <img src={o.imageUrl} alt="" />
                                                    </a>
                                                </div>
                                            )
                                        })}
                                        </div>
                        
                                        <div className="swiper-pagination"></div>
                                    </div>
                                </div>
                            }
                            <div className="maybeYouLove-list-title"><img src={require('./img/maybe_you_love.png')} alt="" />
                                <span>猜您喜欢</span> 
                            </div>
                            <div className="maybeYouLove-list-wrap">
                                {this.state.list &&
                                    commonFn.ArrayFormatData(this.state.list).map((o,i)=>(
                                        <ul className="list-row" key={'row'+this.state.pageIndex+i}>
                                            {o.map((o, i)=>{
                                                return (
                                                    <li className="list-item" key={'col' + this.state.pageIndex +i} onClick={()=>{
                                                        appFunc.toAppProductDetail({
                                                            productId: o.productId,
                                                            productDetailId: o.productDetailId
                                                        });
                                                    }}>
                                                        <dl>
                                                            <dt>
                                                                <img src={o.pic1url} alt="" />
                                                                {o.colornum && o.colornum >= 2 ? <span className="tip">{o.colornum}<br />色可选</span> : ''}
                                                            </dt>
                                                            <dd>
                                                                <p>{o.productsubname}</p>
                                                                <p>{o.tags && o.tags.map((o, i) => (
                                                                    <span key={i}>{o}</span>
                                                                ))}</p>
                                                                <p>{o.name}</p>
                                                                <p><span>¥{o.price}</span>{o.oldprice && o.oldprice != o.price ? <span>¥{o.oldprice}</span> : ''}</p>
                                                                {o.totalevalate > 0 ? <p><span>{o.totalevalate}条评价</span><span>{o.goodrate}%好评</span></p> : <p></p>}
                                                            </dd>
                                                        </dl>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
        
            </PullToRefresh>
        </div>);
    }
}

export class ProductListItemComponent extends React.Component{
    state = {
        data: this.props.data,
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data
        })
        // console.log(nextProps)
    }
    goGoodsDetail(){
        if (this.props.data.productDetailId) {
            window.location.href = url_host + 'mSite/views/Detail_pages/detail.html?detail=' + this.props.data.productDetailId + '&productId=' + this.props.data.productId;
            return;
        };
        window.location.href = url_host + 'mSite/views/Detail_pages/detail.html?parentId=' + this.props.data.productId;
    }
    render(){
        const o = this.props.data;
        return (
            <div className="product-list-item-container" key={this.props.colKey}>
                <ul className="product-list-item-wrap">
                    {this.state.data.isShowCheckBox &&
                        <li className="product-list-item-checkbox">
                            <Checkbox 
                                checked={this.state.data.isChecked}
                                onChange={(e) => {
                                    // this.setState({
                                    //     isChecked: !this.state.isChecked,
                                    // })
                                    if (this.props.onChange) {
                                        this.props.onChange(e);
                                    }
                            }}></Checkbox>
                        </li>
                    }
                    <li className="product-list-item-pic" onClick={()=>{
                        this.goGoodsDetail();
                    }}>
                        <img src={o.pic1url}/>
                    </li>
                    <li className="product-list-item-desc" onClick={() => {
                        this.goGoodsDetail();
                    }}>
                        <p className="product-list-item-name">{o.name}</p>
                        <p className="product-list-item-price-wrap">
                            <span className="product-list-item-price">&yen;{o.price}</span>
                            {o.oldPrice ? <span className="product-list-item-oldPrice">&yen;{o.oldPrice}</span>: ''}   
                        </p>
                    </li>
                </ul>
            </div>
        )
    }
}
// not-data
export class NotDataComponent extends React.Component{
    render(){
        return (
            <div className="not-data-container"
            >
                <div className="not-data-content">
                    <div className="not-data-logo">
                        <img src={require('./img/no_data.png')} alt="" />
                    </div>
                    <div className="not-data-btn" onClick={()=>{
                        window.location.href = url_host+'mSite/views/index/index.html';
                    }}>
                        <span>{this.props.text}</span>
                    </div>
                </div>

            </div>
        )
    }
}
// img-code
export class ImgCodeComponent extends React.Component {
    constructor(props){
        super(props);
        this.state={
            data: null,
        }
    }
    componentDidMount(){
        this.initFetch()
    }
    initFetch=()=>{
        fetch(api_host + 'zhbService/mobile/getVerifyCode', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                "access_token": Cookies.get('access_token')
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                this.setState({
                    data: rs
                })
                if (this.props.getData) {
                    this.props.getData(this.state.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    render() {
        return (
            this.state.data?(
                <div className="imgCode-container" onClick={()=>{
                    this.initFetch();
                }}
                    style={{width: this.props.width? this.props.width: '1.52rem',
                        height: this.props.height? this.props.height: '0.54rem'
                    }}
                >
                    <img src={'data:images/gif;base64,'+this.state.data.image} />
                </div>
            ):null
        )
    }
}
// message-code
export class MessageCodeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "mobile": this.props.sendCodeParams.mobile,
            "gerCode": this.props.sendCodeParams.gerCode, //图片验证码
            "alphanumeric": this.props.sendCodeParams.alphanumeric, // 时间随机数
            restTime: 60,
        }
    }
    componentDidMount() {
        // this.initFetch()
        console.log(this.props.sendCodeParams)
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            "mobile": nextProps.sendCodeParams.mobile,
            "gerCode": nextProps.sendCodeParams.gerCode, //图片验证码
            "alphanumeric": nextProps.sendCodeParams.alphanumeric, // 时间随机数
        })
        console.log(nextProps)
    }
    sendCodeFetch = () => {
        fetch(api_host + 'zhbService/mobile/sendMsgForNewRecruitForH5', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                "mobile": this.state.mobile,
                "gerCode": this.state.gerCode, //图片验证码
                "alphanumeric": this.state.alphanumeric, // 时间随机数
                "access_token": Cookies.get('access_token'),
                platform: 'WeChat'
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                this.props.onClick(rs)
                if(rs.errorCode == 0){
                    this.setState({
                        restTime: this.state.restTime - 1
                    })
                    var timer = setInterval(() => {
                        this.setState({
                            restTime: this.state.restTime - 1
                        }, () => {
                            if (this.state.restTime === 0) {
                                clearInterval(timer)
                                this.setState({
                                    restTime: 60
                                })
                            }
                        })
                    }, 1000)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    render() {
        return (
            <Button className="messageCode-container" 
                style={{
                    width: this.props.width ? this.props.width : '1.68rem',
                    height: this.props.height ? this.props.height : '0.6rem',
                    lineHeight: this.props.height ? this.props.height : '0.6rem',
                }}
                disabled={this.state.restTime < 60}
                onClick={()=>{
                    if (this.props.onClick){
                        this.sendCodeFetch();
                    }
                }}>{this.state.restTime < 60 ? this.state.restTime + 's' : "获取验证码"}</Button>
        )
    }
}
// 分享蒙层
export class ShareMaskComponent extends Component {
    constructor(props) {
        super(props);
        this.nativeShare = null;
    }
    componentWillMount() {

        this.nativeShare = new NativeShare();

        if (appFunc.is_weixn) {  //在微信
            var data = {
                "url": window.location.href.split('#')[0]
            };
            fetch(zhbh5_host + 'h5service/wx/get', {
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: commonFn.urlEncode(data),
            }).then((rs) => {
                return rs.json();
            })
                .then((data) => {
                    this.nativeShare.setConfig({
                        wechatConfig: {
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.nonceStr,
                            signature: data.signature,
                        }
                    })
                    // 设置分享文案
                    this.nativeShare.setShareData({
                        icon: this.props.imgUrl || '',
                        link: this.props.link || '',
                        title: this.props.title || '',
                        desc: this.props.desc || '',
                        from: '',
                        // 只有微信支持
                        trigger: noop,
                    })
                    try {
                        this.nativeShare.call()
                    } catch (err) {
                        // console.log(err)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            // 设置分享文案
            this.nativeShare.setShareData({
                icon: this.props.imgUrl||'',
                link: this.props.link||'',
                title: this.props.title||'',
                desc: this.props.desc||'',
                from: '',
            })
        }
    }
    handleClick(type) {
        //    console.log(this.nativeShare)

        // 唤起浏览器原生分享组件(如果在微信中不会唤起，此时call方法只会设置文案。类似setShareData)
        try {
            this.nativeShare.call(type)
            // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
            // 类似的命令下面有介绍
        } catch (err) {
            // console.log(err)
            // 如果不支持，你可以在这里做降级处理
        }
    }
    render() {
        return (
            !this.props.isShow &&
            null
        )
    }
}