import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, Button, Checkbox, SearchBar} from 'antd-mobile';
import Cookies from 'js-cookie';
import '../libs/swiper-3.4.2.min.js';
import './css/swiper-3.4.2.min.css';
import NativeShare from 'nativeshare';

import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import './css/commonComponent.less';

import moment, { duration } from 'moment';


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

/**
 * tag 2新品、 3为你推荐 、4猜你喜欢、 5top榜 、 6每日上新 、9我可兑换 10精品推荐 11创客列表 12新人专区 13一元专区 14五折 15礼品卡
 * 
 * @export
 * @class GoodsListComponent
 * @extends {React.Component}
 */
export class GoodsListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            down: false,
            height: document.documentElement.clientHeight,
            bannerList: [],
            list: [],
            pageIndex: 1,
            flag: (this.props.flag ? this.props.flag : 4), //为你推荐3  猜你喜欢4
            hasData: true,
            scrollContainerClassName: this.props.scrollContainerClassName || 'am-pull-to-refresh' || 'am-list-view-scrollview',
            isShowScrollTop: false,
        };
    }
    genData() {
        fetch(api_host + 'zhbService/mobile/' + (this.props.port ? this.props.port:'maybeYouLove'), {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                flag: this.state.flag,
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
                    }, () => {
                        if (rs.data.productInfo.list && rs.data.productInfo.list.length > 0) {
                            this.setState({
                                list: this.state.list.concat(rs.data.productInfo.list),
                                pageIndex: (this.state.pageIndex + 1),
                                hasData: true,
                            },()=>{
                                let mySwiper = new Swiper('#maybeYouLove-list-banner-swiper', {
                                    direction: 'horizontal',
                                    loop: (rs.data.bannerList.length > 1 ? true : false),
                                    pagination: (rs.data.bannerList.length > 1 ? '.swiper-pagination' : ''),
                                })
                                // 从商品详情返回列表定位
                                commonFn.listScrollBackPosition(this.state.scrollContainerClassName, 'get', '', (fetchParams,callback)=>{
                                    if(this.state.pageIndex <=fetchParams.pageIndex){
                                        this.genData();
                                    }else{ // 循环请求成功
                                        callback();
                                    }
                                    console.log(fetchParams)
                                })
                            })
                        } else {
                            this.setState({
                                hasData: false
                            })
                        }
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
                    if (this.state.hasData) {
                        this.setState({ refreshing: true }, () => {
                            this.genData();
                        });
                    } else {
                        return false
                    }
                }}
                onScroll={(e)=>{
                    let scrollTop = document.getElementsByClassName(this.state.scrollContainerClassName)[0].scrollTop;
                    let scrollContainerHeight = parseInt(document.getElementsByClassName(this.state.scrollContainerClassName)[0].style.height);
                    if (scrollTop >= 2 * scrollContainerHeight) { //大于2屏幕内容
                        this.setState({
                            isShowScrollTop: true,
                        })
                    } else {
                        this.setState({
                            isShowScrollTop: false,
                        })
                    }
                }}
            >
                <div className="maybeYouLove-list-container">
                    <div className="maybeYouLove-list-content">
                        {this.props.isShowBanner && this.state.bannerList && this.state.bannerList.length > 0 &&
                            <div className="maybeYouLove-list-banner">
                                <div className="swiper-container" id="maybeYouLove-list-banner-swiper">
                                    <div className="swiper-wrapper">
                                        {this.state.bannerList.map((o, i) => {
                                            return (
                                                <div className="swiper-slide" key={i} onClick={() => {
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
                        {this.props.listHeader}
                        {this.props.listTitle &&   
                            <div className="maybeYouLove-list-title"><img src={require('./img/maybe_you_love.png')} alt="" />
                                <span>{this.props.listTitle}</span>
                            </div>
                        }
                        {this.state.list && this.state.list.length > 0 &&
                            <div className="maybeYouLove-list-wrap">
                                {this.state.list &&
                                    commonFn.ArrayFormatData(this.state.list).map((o, i) => (
                                        <ul className="list-row" key={'row' + this.state.pageIndex + i}>
                                            {o.map((o, i) => {
                                                return (
                                                    <li className="list-item" key={'col' + this.state.pageIndex + i} onClick={() => {
                                                        commonFn.listScrollBackPosition(this.state.scrollContainerClassName,'set', {
                                                            pageIndex: this.state.pageIndex-1,
                                                            flag: this.state.flag,
                                                        })
                                                        appFunc.toAppProductDetail({
                                                            productId: o.productId,
                                                            productDetailId: o.productDetailId
                                                        });
                                                    }}>
                                                        <dl>
                                                            <dt>
                                                                <img src={o.pic1url} alt="" />
                                                                {o.colornum && o.colornum >= 2 ? <span className="tip">{o.colornum}<br />色可选</span> : ''}
                                                                {o.topRank && o.topRank > 0 ? <span className="top-rank">{o.topRank}</span>: ''}
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
                        }
                    </div>
                </div>

            </PullToRefresh>
            {this.state.isShowScrollTop &&
                <ScrollToTopComponent
                    scrollContainerClassName={this.state.scrollContainerClassName}
                />
            }
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
// GoodsListITem
/**
 *  name: ,
    colornum: ,
    productsubname: ,
    tags: [],
    name: ,
    price: ,
    oldprice: ,
    totalevalate: ,
    goodrate: ,
 */
export class TwoLineGoodsListItemComponent extends React.Component {
    componentDidMount() {

    }
    render() {
        const line = this.props.data;
        return (
            <div className="twolinegoods">
                {line.length&&line.map((o,k)=>{
                    return(
                        <div className="goods-list-item-container" key={k}>
                            {o?<dl onClick={() => {
                                appFunc.toAppProductDetail({
                                    productId: o.productId,
                                    productDetailId: o.productDetailId
                                });
                            }}>
                                <dt>
                                    <img src={o.pic1url} alt="" />
                                    {o.colornum && o.colornum >= 2 ? <span className="tip">{o.colornum}<br />色可选</span> : ''}
                                    {o.topRank && o.topRank > 0 ? <span className="top-rank">{o.topRank}</span> : ''}
                                </dt>
                                <dd>
                                    <p>{o.productsubname}</p>
                                    <p>{o.tags && o.tags.map((o, i) => (
                                        <span key={i}>{o}</span>
                                    ))}</p>
                                    <p>{o.name}</p>
                                    <p><span>¥{o.price}</span>{o.oldprice && o.oldprice != o.price ? <span>¥{o.oldprice}</span> : ''}</p>
                                    {o.totalevalate && o.totalevalate > 0 ? <p><span>{o.totalevalate}条评价</span><span>{o.goodrate}%好评</span></p> : <p></p>}
                                </dd>
                            </dl>:''}
                            
                        </div>
                    )
                })}

            </div>
            
        )
    }
}
export class GoodsListItemComponent extends React.Component {
    componentDidMount() {

    }
    render() {
        const o = this.props.data;
        return (
            <div className="goods-list-item-container">
                <dl onClick={() => {
                    appFunc.toAppProductDetail({
                        productId: o.productId,
                        productDetailId: o.productDetailId
                    });
                }}>
                    <dt>
                        <img src={o.pic1url} alt="" />
                        {o.colornum && o.colornum >= 2 ? <span className="tip">{o.colornum}<br />色可选</span> : ''}
                        {o.topRank && o.topRank > 0 ? <span className="top-rank">{o.topRank}</span> : ''}
                    </dt>
                    <dd>
                        <p>{o.productsubname}</p>
                        <p>{o.tags && o.tags.map((o, i) => (
                            <span key={i}>{o}</span>
                        ))}</p>
                        <p>{o.name}</p>
                        <p><span>¥{o.price}</span>{o.oldprice && o.oldprice != o.price ? <span>¥{o.oldprice}</span> : ''}</p>
                        {o.totalevalate && o.totalevalate > 0 ? <p><span>{o.totalevalate}条评价</span><span>{o.goodrate}%好评</span></p> : <p></p>}
                    </dd>
                </dl>
            </div>
        )
    }
}






export class PintuanItemComponent extends React.Component {
// productid
    render() {
        const o = this.props.data;
        return (
            <div>
                <div className="pt_item_detail" onClick={()=>{
                    window.location.href = url_host+'tSite/views/detail/detail.html?gpnum='+ o.group_purchase_number;
                }}>
                    <div className="pic" >
                        <a>{o.totalpeople}人团</a>
                        <img src={o.picurl} alt="" />
                    </div>
                    <div className="basic">
                        <p className="good-title">{o.product_name}</p>
                        <p className="good-price"><em className="price">&yen;{o.price}</em><em className="oldprice">&yen;{o.oldprice}</em></p>
                        <p className="buy-number">已团{o.groupsalenumber}件</p>
                        <p className="btn"><a>去开团</a></p>
                    </div>
                </div>
            </div>
        )
    }
}
// SearchBarComponent
export class SearchBarComponent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            searchWord: this.props.searchWord || '',
            placeholder: this.props.placeholder || '',
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            searchWord: nextProps.searchWord || '',
        })
    }
    componentWillMount(){
        fetch(api_host + 'zhbService/mobile/getSearchKeyWord', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token') || '1352467890bqfy',
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    this.setState({
                        placeholder: rs.data
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
                //     // this.initFetch();
                // });
            })
    }
    render(){
        console.log(this.state.placeholder)
        return(
            <div className="search-bar-container">
                {this.props.isShowLeft &&
                    <div className="search-bar-left" onClick={()=>{
                        if(this.props.onLeftClick){this.props.onLeftClick()}
                    }}><img src={require('./img/search_back.png')} /></div>
                }
                <div className="search-bar-content" onClick={()=>{
                    if (this.props.onClick) {this.props.onClick() }
                }}>
                    <SearchBar
                        value={this.state.searchWord}
                        defaultValue={''}
                        placeholder={this.state.placeholder}
                        cancelText="搜索"
                        showCancelButton={true}
                        disabled={this.props.disabled || false}
                        onSubmit={value => console.log(value, 'onSubmit')}
                        onFocus={() => {
                            console.log('onFocus')
                            if(this.props.onFocus){this.props.onFocus()}
                        }}
                        onBlur={() => console.log('onBlur')}
                        onCancel={(value)=>{
                            console.log(value)
                            if(this.props.onCancel){this.props.onCancel(this.state.placeholder)}
                        }}
                        onChange={(value) => {
                            this.setState({
                                searchWord: value,
                            })
                            if(this.props.onChange){this.props.onChange(value)}
                        }}
                    />
                </div>
            </div>
        )
    }
}

// 返回顶部
export class ScrollToTopComponent extends Component {
    constructor(props){
        super(props);
        this._easeout = function (start, end, rate, callback) {
            var _end = end;
            if (start == end || typeof start != 'number') {
                　　return;
            }
            　　end = end || 0;
            　　rate = rate || 2;

            var step = function () {
                　　start = start + (end - start) / rate;
                if (Math.abs(start - _end) < 1) {


                    　　console.log('end');
                    　　callback(end, true);
                    　　return;
                }
                　　callback(start, false);
                　　requestAnimationFrame(step);
            };
            　　step();
        };
    }
    render() {
        return (
            <div className="scroll-to-top-container"
                onClick={() => {
                    if (this.props.scrollContainerClassName){
                        this._easeout(document.getElementsByClassName(this.props.scrollContainerClassName)[0].scrollTop, 0, Math.pow(3, this.props.duration|| 0) , (value)=> {
                            　　　　document.getElementsByClassName(this.props.scrollContainerClassName)[0].scrollTop = value;
                    　　})
                    }
                }}
            >
                <img src={require('./img/back_top.png')} />
            </div>
        )
    }
}
// 首页启动弹窗
/**  displayfrequency  0 仅第一次启动显示 1 每日仅首次启动显示 2 每次启动显示弹窗
 * 
 * isShow 0不显示   1 显示
    style 1 第一类弹窗模板：一张图片，2 第二类弹窗模板：左右结构显示，3 第三类弹窗模板：上下结构显示，
    isDisplay  0 显示 1 不显示 底部关闭按钮
 */

export class IndexStartMaskComponent extends Component {
    constructor(props){
        super(props);
        this.state={
            data: null,
            isClose: false,
        }
    }
    componentDidMount(){
        fetch(api_host + 'zhbService/mobile/popupActivity', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                // platForm: 'WeCaht'
            })
        }).then((rs) => {
            return rs.json()
        }).then((rs) => {
            this.setState({
                data: rs.data
            })
            if (localStorage.getItem('indexStartMask')){
                let { now, displayfrequency, id} = JSON.parse(localStorage.getItem('indexStartMask'));
                if(id == rs.data.id){   //同一个活动
                    if (displayfrequency == 0){ //只展示一次
                        this.setState({
                            isClose: true,
                        })
                    }else{
                        if(now == rs.data.now){
                            this.setState({
                                isClose: true,
                            })
                        }else{
                            this.setState({
                                isClose: false,
                            })
                        }
                    }
                }else{ 
                    this.setState({
                        isClose: false,
                    })
                }
            }
            if (rs.data.now){
                localStorage.setItem('indexStartMask', JSON.stringify({
                    now: rs.data.now,
                    displayfrequency: rs.data.displayfrequency,
                    id: rs.data.id
                }))
            }
        })
    }
    render() {
        return (!this.state.isClose && this.state.data && this.state.data.isShow == 1 && this.state.data.banner[0].imageUrl? (
            <div className="index-start-mask-container">
                <div className="index-start-mask-content">
                    {this.state.data.style == 1 &&
                        <div className="index-start-mask-pic">          
                            <img className="index-start-mask-pic-mid" src={this.state.data.banner[0].imageUrl} onClick={()=>{
                                appFunc.gotoAppUrlFormat(this.state.data.banner[0].linkURL)
                            }}/>
                        </div>
                    }
                    {this.state.data.style == 2 &&
                        <div className="index-start-mask-pic">          
                            <img className="index-start-mask-pic-left" src={this.state.data.banner[0].imageUrl} onClick={()=>{
                                appFunc.gotoAppUrlFormat(this.state.data.banner[0].linkURL)
                            }}/>
                            <img className="index-start-mask-pic-right" src={this.state.data.banner[1].imageUrl} onClick={()=>{
                                appFunc.gotoAppUrlFormat(this.state.data.banner[1].linkURL)
                            }}/>
                        </div>
                    }
                    {this.state.data.style == 3 &&
                        <div className="index-start-mask-pic">
                            <img className="index-start-mask-pic-top" src={this.state.data.banner[0].imageUrl} onClick={()=>{
                                appFunc.gotoAppUrlFormat(this.state.data.banner[0].linkURL)
                            }}/>
                            <img className="index-start-mask-pic-bottom" src={this.state.data.banner[1].imageUrl} onClick={()=>{
                                appFunc.gotoAppUrlFormat(this.state.data.banner[1].linkURL)
                            }}/>
                        </div>
                    }
                    {this.state.data.isdisplay == 0 &&
                        <div className="index-start-mask-close"><img src={require('./img/close.png')} onClick={()=>{
                            this.setState({
                                isClose: true, 
                            })
                        }}/></div>
                    }
                </div>
            </div>
        ): null)
    }
}
// loadding 加载中
export class  LoadingComponent extends Component{
    render(){
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <img src={require('./img/loading.gif')}/>
                    <p>加载中…</p>
                </div>
            </div>
        )
    }
}
// TabBar
export class TabBarComponent extends Component {
    state = {
        activeIndex: this.props.activeIndex,
        cartNum: 0,
    };
    componentDidMount() {
        var uid = Cookies.get('uid');
        var token = Cookies.get('access_token');
        // 购物车图标数量
        if (!uid || uid == 'undefined') {
            var s;
            s = localStorage.getItem("localShoppingCart") || '[]';
            s = JSON.parse(s);
            //alert(s)
            var sum = 0;
            if (s.length > 0) {
                for (var i = 0; i < s.length; i++) {
                    sum += Number(s[i].goodsNum);
                }
            }
            this.setState({
                cartNum: sum > 99 ? "99+" : sum
            })
        } else {
            let getCartNum = () => {
                $.ajax({
                    url: api_host + 'zhbService/mobile/getCartByUserId',
                    method: 'post',
                    data: {
                        "userId": Cookies.get('uid'),
                        "access_token": Cookies.get('access_token'),
                        platform: 'WeChat',
                        version: '3.0.0',
                    },
                    success: (rs) => {
                        if (rs.errorCode == 0) {
                            var data = rs.data;
                            console.log(data)
                            var sum = 0;
                            if (data.items && data.items.length != 0) {
                                for (var i = 0; i < data.items.length; i++) {
                                    sum += data.items[i].buyNum;
                                }
                            }
                        }
                        this.setState({
                            cartNum: sum > 99 ? "99+" : sum
                        })

                    },
                    error: (err) => {
                        if (err) { // token 失效
                            commonFn.getNewToken('', () => {
                                getCartNum();
                            })
                        }
                    }
                })
            };
            getCartNum();
        }
    }
    handleClick(key, linkUrl) {
        if (this.state.activeIndex == key) { return };
        this.setState({
            activeIndex: key
        })
        window.location.href = linkUrl;
    }
    render() {
        return (
            <div className="tabBar-container">
                <ul>
                    <li className={this.state.activeIndex == 1 ? "on" : ""} onClick={this.handleClick.bind(this, 1, url_host + 'mSite/views/index/index.html')}>
                        <a>
                            <img src={require('../components/img/index' + (this.state.activeIndex == 1 ? '_on' : '') + '.png')} />
                            <i>首 页</i>
                        </a>
                    </li>
                    <li className={this.state.activeIndex == 2 ? "on" : ""} onClick={this.handleClick.bind(this, 2, url_host + "mSite/views/lifeService/lifeService.html")}>
                        <a>
                            <img src={require('../components/img/life' + (this.state.activeIndex == 2 ? '_on' : '') + '.png')} />
                            <i>爱品汇</i>
                        </a>
                    </li>
                    <li className={this.state.activeIndex == 3 ? "on" : ""} onClick={this.handleClick.bind(this, 3, url_host + "makerSite/app.html#/index")}>
                        <a>
                            <img className="big-logo" src={require('../components/img/maker.png')} />
                            <i>爱联盟</i>
                        </a>
                    </li>
                    <li className={this.state.activeIndex == 4 ? "on" : ""} onClick={this.handleClick.bind(this, 4, url_host + "mSite/views/productDetail/shoppingCart.html?from=index")}>
                        <a>
                            <img src={require('../components/img/cart' + (this.state.activeIndex == 4 ? '_on' : '') + '.png')} />
                            <i>购物车</i>
                            {Number(this.state.cartNum) > 0 &&
                                <b className="tabBar-cart-badge">{Number(this.state.cartNum)}</b>
                            }
                        </a>
                    </li>
                    <li className={this.state.activeIndex == 5 ? "on" : ""} onClick={this.handleClick.bind(this, 5, url_host + "mSite/views/my/index.html")}>
                        <a>
                            <img src={require('../components/img/my' + (this.state.activeIndex == 5 ? '_on' : '') + '.png')} />
                            <i>我 的</i>
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}