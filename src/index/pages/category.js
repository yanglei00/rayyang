const React = require('react');

import { Button, Tabs } from 'antd-mobile';
import Cookies from 'js-cookie';
import '../../libs/swiper-3.4.2.min.js';
import '../../components/css/swiper-3.4.2.min.css';

import appFunc from '../../libs/appfuncs';
import commonFn from '../../libs/commonfn';
import { GoodsListItemComponent, GoodsListComponent, SearchBarComponent, LoadingComponent } from '../../components/commonComponent';

import './css/category.less';

const tabs = [];
class CategoryComponent extends React.Component {
    state = {
        data: null,
        isLoading: true,
    }

    componentWillMount() {
        document.title = "商品列表";
        this.initFetch();
    }
    componentDidMount() {
    
    }
    initFetch = (value) => {
        fetch(api_host + 'zhbService/mobile/productCategoryFirst', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                version: '3.0.3',
                platform: 'WeChat',
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    if (rs.data) {
                        tabs.length = 0;
                        rs.data.map((o, i) => {
                            tabs.push({
                                title: o.classifyName,
                            })
                        })
                        // [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,30,40].map((o, i) => {
                        //     tabs.push({
                        //         title: 'haha'+i,
                        //     })
                        // })
                    }
                    this.setState({
                        data: rs.data,
                        isLoading: false,
                    },()=>{
                        this.initSwiper(0,rs.data[0].firstClassify.bannerList.length);
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
                    // this.initFetch();
                });
            })
    }
    switchFetch = (tab,index) => {
        console.log(tab,index)
        let classifyID = this.state.data[index].classifyID
        console.log(classifyID)
        fetch(api_host + 'zhbService/mobile/productCategorySecond', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                classifyID: classifyID,
                version: '3.0.3',
                platform: 'WeChat',
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    this.setState({
                        data: [
                            ...this.state.data.slice(0, index),
                            Object.assign({},this.state.data[index],{
                                firstClassify: rs.data
                            }),
                            ...this.state.data.slice(index+1)
                        ]
                    },()=>{
                        this.initSwiper(index,rs.data.bannerList.length);
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
    initSwiper(index,length){
        let mySwiper = new Swiper('#category-list-banner-swipe-'+index, {
            direction: 'horizontal',
            spaceBetween: 15,
            loop: (length > 1 ? true : false),
            pagination: (length > 1 ? '.swiper-pagination' : ''),
            observer: true,
            observeParents: true,
        })
    }
    render() {
        return (
            <div className="category-container">
                {commonFn.getUrlAttribute('beFrom') != 'index' &&
                    <SearchBarComponent
                        isShowLeft={true}
                        disabled={true}
                        onLeftClick={() => {
                            // window.history.back();
                        }}
                        onClick={() => {
                            commonFn.history.push('/search')
                        }}
                    />
                }
                {this.state.data&& tabs &&
                    <div className="tabs-container">
                    <Tabs 
                            tabs={tabs}
                            renderTabBar={(props)=>{
                            return(<Tabs.DefaultTabBar
                                {...props}
                                page={12}
                            ></Tabs.DefaultTabBar>)}}
                            tabBarPosition="left"
                            tabDirection="vertical"
                            animated={false}
                            tabBarUnderlineStyle={{
                                border: 0,
                            }}
                            onChange={this.switchFetch.bind(this)}
                        >
                        {this.state.data.map((o, i)=>{
                            return (
                                <div className="category-tabpanel-container" key={i}>
                                    <div className="category-tabpanel-banner">
                                        {o.firstClassify && o.firstClassify.bannerList && o.firstClassify.bannerList.length > 0 &&
                                            <div className="swiper-container" id={'category-list-banner-swipe-'+i}>
                                                <div className="swiper-wrapper">
                                                    {o.firstClassify.bannerList.map((o, i) => {
                                                            return (
                                                                <div className="swiper-slide" key={i} onClick={() => {
                                                                    appFunc.gotoAppUrlFormat(o.linkUrl);
                                                                }}>
                                                                    <a className="category-list-banner-swiper-img" >
                                                                        <img src={o.imageUrl} alt="" />
                                                                    </a>
                                                                </div>
                                                            )
                                                        })}
                                                    {/* <div className="swiper-slide" key={0} onClick={() => {
                                                        appFunc.gotoAppUrlFormat(o.linkUrl);
                                                    }}>
                                                        <a className="category-list-banner-swiper-img" >
                                                            11
                                                            </a>
                                                    </div>
                                                    <div className="swiper-slide" key={1} onClick={() => {
                                                        appFunc.gotoAppUrlFormat(o.linkUrl);
                                                    }}>
                                                        <a className="category-list-banner-swiper-img" >
                                                            2222
                                                            </a>
                                                    </div> */}
                                                </div>
                                                <div className="swiper-pagination"></div>
                                            </div>
                                        }
                                    </div>
                                    <div className="category-tabpanel-list">
                                        {o.firstClassify && o.firstClassify.dataList && o.firstClassify.dataList.map((o,i)=>{
                                            return (
                                                <div className="category-tabpanel-item" key={i}>
                                                    <div className="category-tabpanel-item-title">{o.secClassifyName}</div>
                                                    <div className="category-tabpanel-item-content">
                                                        {o.thirdClassifyArray && o.thirdClassifyArray.map((o,i)=>{
                                                            return (
                                                                <div className="category-tabpanel-item-content-item" key={i} onClick={()=>{
                                                                    commonFn.history.push({
                                                                        pathname: 'categoryGoodsList',
                                                                        search: '?thirdClassifyID=' + o.thirdClassifyID + '&thirdClassifyName=' + encodeURIComponent(o.thirdClassifyName),
                                                                    })
                                                                }}>
                                                                    <img src={o.thirdClassifyImg} alt=""/>
                                                                    <p>{o.thirdClassifyName}</p>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                        </Tabs>
                    </div>
                }
                {this.state.isLoading &&
                    <LoadingComponent/>
                }
            </div>
        )
    }
}
export default CategoryComponent;



