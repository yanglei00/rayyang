import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, Button } from 'antd-mobile';
import Cookies from 'js-cookie';
import '../libs/swiper-3.4.2.min.js';
import '../pages/css/lib/swiper-3.4.2.min.css';

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
export class AlikeComponent extends React.Component {
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
        fetch(api_host + 'zhbService/mobile/' + (this.props.fetchName ? this.props.fetchName:'maybeYouLove'), {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                flag: (this.props.flag ? this.props.flag :7), //为你推荐3  猜你喜欢4
                pageIndex: this.state.pageIndex,
                pageSize: 20,
                version: '3.0.0',
                platform: 'WeChat',
                ...this.props.fetchParams
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
                    refreshing: false
                },()=>{
                    if (this.props.oneKey){
                        if (rs.data[this.props.oneKey] && rs.data[this.props.oneKey].length > 0) {
                            this.setState({
                                list: this.state.list.concat(rs.data[this.props.oneKey]),
                                pageIndex: (this.state.pageIndex + 1),
                                hasData: true,
                            })
                        } else {
                            this.setState({
                                hasData: false
                            })
                        }
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
                    if(this.state.hasData){
                        this.setState({ refreshing: true }, ()=>{
                            this.genData();
                        });
                    }else{
                        return false
                    }
                }}
            >
                <div className="alikeList-container">
                    <div className="alikeList-header" onClick={()=>{
                        if (this.props.headerParams.productDetailId) {
                            window.location.href = url_host + 'mSite/views/Detail_pages/detail.html?detail=' + this.props.headerParams.productDetailId + '&productId=' + this.props.headerParams.productId;
                            return;
                        };
                        window.location.href = url_host + 'mSite/views/Detail_pages/detail.html?parentId=' + this.props.headerParams.productId;
                    }}>
                        <div className="product-list-item-container">         
                            <ul className="product-list-item-wrap">
                                <li className="product-list-item-pic" onClick={() => {
                                    
                                }}>
                                    <img src={this.props.headerParams.picUrl} />
                                    <img className="no-good" src={require('./img/no_good.png')}/>
                                </li>
                                <li className="product-list-item-desc" onClick={() => {
                                }}>
                                    <p className="product-list-item-name">{this.props.headerParams.name}</p>
                                    <p className="product-list-item-small">{this.props.headerParams.subName}</p>
                                    <p className="product-list-item-price-wrap">
                                        <span className="product-list-item-price">&yen;{this.props.headerParams.price}</span>
                                        {this.props.headerParams.oldPrice ? <span className="product-list-item-oldPrice">&yen;{this.props.headerParams.oldPrice}</span> : ''}
                                    </p>
                                </li>
                                <li className="product-list-item-arrow">
                                    <img src={require('./img/arrow_right.png')}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="alikeList-content">
                            { this.state.bannerList && this.state.bannerList.length > 0 &&
                                <div className="alikeList-banner">
                                    <div className="swiper-container" id="alikeList-banner-swiper">
                                        <div className="swiper-wrapper">
                                        {this.state.bannerList.map((o, i)=>{
                                            return (
                                                <div className="swiper-slide" key={i} onClick={()=>{
                                                    appFunc.gotoAppUrlFormat(o.linkUrl);
                                                }}>
                                                    <a className="alikeList-banner-swiper-img" >
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
                            <div className="alikeList-title">
                            <span>相似商品</span> 
                            </div>
                            <div className="alikeList-wrap">
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