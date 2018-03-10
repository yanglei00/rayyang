
const React = require('react');
const ReactDOM = require('react-dom');
import commonFn from '../../libs/commonfn.js';
import appFunc from '../../libs/appfuncs.js';
import Cookies from 'js-cookie';
import { PullToRefresh, Flex, Toast, Modal, Drawer, List, InputItem, Popover } from 'antd-mobile';
const Item = Popover.Item;
import ListContainer from '../../components/listContainer';
import { createForm } from 'rc-form';
// import Progess from './progess.js';
// import { appFunc } from './../libs/appfuncs.js'
import  {ScrollToTopComponent} from '../../components/commonComponent';
const alert = Modal.alert;
import { Redirect } from 'react-router-dom';
import createHistory from 'history/createHashHistory'
const history = createHistory()
import { Link } from 'react-router-dom';
import './css/categoryGoodsList.less';
import result_img from './img/search_result.png'


const list1 = [
    { txt: "综合排序", val: '4' },
    { txt: "销量排序", val: '2' },
    { txt: "好评排序", val: '5' },
    { txt: "新品排序", val: '6' },
];
const list2 = [
    { txt: "从低到高", val: '1' },
    { txt: "从高到低", val: '2' }
];

class GoodsListItem extends React.Component {
    state={
        fetchParams: this.props.fetchParams,
        pageIndex: this.props.pageIndex,
        lineType: this.props.lineType,
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            fetchParams: nextProps.fetchParams,
            pageIndex: nextProps.pageIndex,
            lineType: nextProps.lineType,
        })
    }
    render() {
        let lineDatas = this.props.data;
        return (
            <div className="linePro">
                {lineDatas && lineDatas.map((line_data, lineKey) => {
                    return (
                        line_data? 
                            <div className="lineItem" onClick={() => {
                                commonFn.listScrollBackPosition(this.props.scrollContainerClassName, 'set', {
                                    data: this.state.fetchParams,
                                    pageIndex: this.state.pageIndex,
                                    lineType: this.state.lineType
                                })
                                appFunc.toAppProductDetail({
                                    productDetailId: line_data.productDetailId,
                                    productId: line_data.productId
                                })
                            }
                            } key={lineKey}>
                                <div className="img_left">
                                    {(line_data.colornum > 1 ? <em>{line_data.colornum + '色可选'}</em> : '')}
                                    {line_data.topRank && line_data.topRank > 0 ? <span className="top-rank">{line_data.topRank}</span> : ''}
                                    <img src={line_data.pic1url} alt="" />
                                </div>
                                <div className="price_right">
                                    <div className="name">{line_data.name}</div>
                                    <div className="lineTitle">{line_data.title}</div>
                                    {line_data.tags.length ? (<div className="tags">{line_data.tags.map((ii, kk) => (<span key={kk}>{ii}</span>))}</div>) : ''}
                                    <div className="price"><span>{'￥' + line_data.price}</span><span>{line_data.oldprice && '￥' + line_data.oldprice}</span></div>

                                    {Number(line_data.totalevalate) ? <div className="pingjia_line"><span className="pingjia_num">{line_data.totalevalate}条评价</span><span className="pingjia_rang">{line_data.goodrate}%好评</span></div> : ''}


                                </div>

                                <div className="main_right">
                                    <div className="goodTitle">{line_data.title}</div>
                                    <div className="tags">{line_data.tags.map((ii, kk) => (<span key={kk}>{ii}</span>))}</div>
                                    <div className="name">{line_data.name}</div>
                                    <div className="price"><span>{'￥' + line_data.price}</span><span>{line_data.oldprice && '￥' + line_data.oldprice}</span></div>
                                    {Number(line_data.totalevalate) ? <div className="pingjia_line"><span className="pingjia_num">{line_data.totalevalate}条评价</span><span className="pingjia_rang">{line_data.goodrate}%好评</span></div> : ''}
                                </div>

                            </div>
                        :null
                    )
                })}
            </div>



        )
    }
}

/**
 * flag 2新品、 3为你推荐 、4猜你喜欢、 5top榜 、 6每日上新 、9我可兑换 10精品推荐 11创客列表 12新人专区 13一元专区 14五折 15礼品卡
 * orderBy 1人气、2销量、3价格 4综合 5 好评 6 新品 7周销量 8用户推荐排序
 * categoryId 分类id
 */
class CategoryGoodsList extends React.Component {
    state = {
        brandList: [],
        lineType: false,
        userId: Cookies.get('uid'),
        token: Cookies.get('access_token'),
        data: [],
        ajaxParams: {
            url: api_host + 'zhbService/mobile/queryProductList',
            // url: '../../mock/list.json',
            data: {
                version: '3.0.2',
                platform: 'mSite',
                access_token: Cookies.get("access_token") || '1352467890bqfy',
                pageSize: 20,
                price1: "",
                price2: "",
                brandname: "",
                orderBy: null,
                orderType: null,
                flag: commonFn.getUrlAttribute('flag') || '',
                orderBy: '',
                orderType: '',
                categoryId: commonFn.getUrlAttribute('thirdClassifyID') || '',
                condition: commonFn.getUrlAttribute('condition'),
            },
            rsDataTwoKey: 'list',
            rsDatakey: 'data'
        },
        noData: false,
        open: false,
        list1visible: false,
        list2visible: false,
        needGetBrand: true,
        isShowScrollTop: false,
        scrollContainerClassName: 'am-list-view-scrollview',
    }
    componentWillMount() {
        let title = '商品列表';
        if (commonFn.getUrlAttribute('thirdClassifyName')) {
            title = decodeURIComponent(commonFn.getUrlAttribute('thirdClassifyName'));
        }
        document.title = title;
        if (sessionStorage.listScrollparams) {
            let { hash, fetchParams } = JSON.parse(sessionStorage.getItem('listScrollparams'));
            if (hash == window.location.hash) {
                this.setState({
                    lineType: fetchParams.lineType,
                })
                // 从商品详情返回列表定位
                if (fetchParams && fetchParams.data && (JSON.stringify(fetchParams.data) != JSON.stringify(this.state.ajaxParams.data))){
                    this.setState({
                        lineType: fetchParams.lineType,
                        ajaxParams: {
                            ...this.state.ajaxParams,
                            data: Object.assign({}, this.state.ajaxParams.data, fetchParams.data )
                        },
                    })
                }
            }
        }
    }
    inputChange = () => {
        if (this.props.form.getFieldValue('price1') && this.props.form.getFieldValue('price2') && (~~this.props.form.getFieldValue('price1') > ~~this.props.form.getFieldValue('price2'))) {
            this.props.form.setFieldsValue({
                price1: this.props.form.getFieldValue('price2'),
                price2: this.props.form.getFieldValue('price1'),
            })
            this.setState({
                ajaxParams: {
                    ...this.state.ajaxParams,
                    data: {
                        ...this.state.ajaxParams.data,
                        price1: this.props.form.getFieldValue('price1'),
                        price2: this.props.form.getFieldValue('price2'),
                    }
                }
            })
        }
    }
    list1visibleChange = () => {

        this.setState({
            list1visible: !this.state.list1visible,
            list2visible: false
        })
    }
    list2visibleChange = () => {
        this.setState({
            list1visible: false,
            list2visible: !this.state.list2visible
        })
    }
    componentDidMount() {
        this.setState({
            listHeight: document.body.clientHeight - document.getElementById('navTopHeight').clientHeight
        })
        // appFunc.navigationBarUpdated('品牌五折专区', '11');
        this.setState({
            ajaxParams: {
                ...this.state.ajaxParams,
                data: {
                    ...this.state.ajaxParams.data,
                    price1: this.props.form.getFieldValue('price1')||'',
                    price2: this.props.form.getFieldValue('price2')||'',
                }
            }
        })
    }
    onOpenChangeStatus = () => {
        if (this.state.open) {
            this.setState({
                key: new Date().getTime()
            })
        }
        this.setState({
            open: !this.state.open,
            list1visible: false,
            list2visible: false
        })
    }
    onOpenChange = () => {
        this.setState({
            open: !this.state.open,
            list1visible: false,
            list2visible: false
        })
    }
    refresh = () => {
        this.setState({
            key: new Date().getTime()
        })
    }
    findElem = (arrayToSearch, val) => {
        for (var i = 0; i < arrayToSearch.length; i++) {
            if (arrayToSearch[i]['val'] == val) {
                return i;
            }
        }
        return false;
    }
    render() {
        const popover1 = (<div></div>);
        const popover2 = (<div></div>);

        const { getFieldProps } = this.props.form;
        const sidebar = (<div>
            <input type="hidden" id="navStyle" value="8" />
            <div className="pricegrid">
                <div className="drawer-title">
                    价格区间
                </div>
                <div className="priceInput">
                    <Flex>
                        <Flex.Item>
                            <InputItem
                                {...getFieldProps('price1', {
                                }) }
                                id="price1"
                                type='tel'
                                placeholder="最低价"
                                maxLength={8}
                                onBlur={this.inputChange}
                                onKeyUp={() => {
                                    this.setState({
                                        ajaxParams: {
                                            ...this.state.ajaxParams,
                                            data: {
                                                ...this.state.ajaxParams.data,
                                                price1: this.props.form.getFieldValue('price1'),
                                                price2: this.props.form.getFieldValue('price2'),
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex.Item>
                        <div className="devide">-</div>
                        <Flex.Item>
                            <InputItem
                                {...getFieldProps('price2', {
                                }) }
                                id="price2"
                                type='tel'
                                placeholder="最高价"
                                maxLength={8}
                                onBlur={this.inputChange}
                                onKeyUp={() => {
                                    this.setState({
                                        ajaxParams: {
                                            ...this.state.ajaxParams,
                                            data: {
                                                ...this.state.ajaxParams.data,
                                                price1: this.props.form.getFieldValue('price1'),
                                                price2: this.props.form.getFieldValue('price2'),
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex.Item>
                    </Flex>
                </div>
            </div>
            <div className="brandgrid">
                <div className="drawer-title">
                    品牌
                </div>
                <div className="brandList">
                    {
                        this.state.brandList && this.state.brandList.map((i, index) => {
                            return <span
                                onClick={() => {
                                    this.state.ajaxParams.data.brandname == i ? this.setState({
                                        ajaxParams: {
                                            ...this.state.ajaxParams,
                                            data: {
                                                ...this.state.ajaxParams.data,
                                                brandname: ""
                                            }
                                        }
                                    }) : this.setState({
                                        ajaxParams: {
                                            ...this.state.ajaxParams,
                                            data: {
                                                ...this.state.ajaxParams.data,
                                                brandname: i
                                            }
                                        }
                                    })
                                }}
                                className={this.state.ajaxParams.data.brandname == i ? 'on' : ''}
                                key={'brand' + index}>
                                {i}
                            </span>
                        })
                    }
                </div>
            </div>
            <div className="foter">
                <a onClick={() => {
                    this.setState({
                        ajaxParams: {
                            ...this.state.ajaxParams,
                            data: {
                                ...this.state.ajaxParams.data,
                                brandname: "",
                                price1: "",
                                price2: "",
                            }
                        }
                    })
                    this.props.form.setFieldsValue({
                        price1: "",
                        price2: "",
                    })
                }}>重置</a>
                <a onClick={this.onOpenChangeStatus}>确定</a>
            </div>
        </div>);
        return (
            <div className={this.state.lineType ? 'brandHalfOff line_list' : 'brandHalfOff'}>
                <div className="topbar" id="navTopHeight">
                    <Flex>
                        <Flex.Item className={this.findElem(list1, this.state.ajaxParams.data.orderBy) || this.findElem(list1, this.state.ajaxParams.data.orderBy) === 0 ? "colored" : ""} onClick={this.list1visibleChange}>{list1[this.findElem(list1, this.state.ajaxParams.data.orderBy)] ? list1[this.findElem(list1, this.state.ajaxParams.data.orderBy)].txt : "推荐"}<i className={this.state.list1visible ? (this.state.ajaxParams.data.orderBy && this.findElem(list1, this.state.ajaxParams.data.orderBy) ? "down" : "up") : ""}></i></Flex.Item>
                        <Flex.Item className={this.state.ajaxParams.data.orderType ? "colored" : ""} onClick={this.list2visibleChange}>{this.state.ajaxParams.data.orderType ? list2[this.findElem(list2, this.state.ajaxParams.data.orderType)].txt : "价格"}<i className={this.state.list2visible ? (this.state.ajaxParams.data.orderType == '2' ? "down" : "up") : ""}></i></Flex.Item>
                        <Flex.Item onClick={() => {
                            this.onOpenChange()
                        }}>筛选<i className="select_icon"></i>
                        </Flex.Item>
                        <div onClick={() => {
                            this.setState({
                                lineType: !this.state.lineType
                            })

                        }}><i className={this.state.lineType ? "line_icon" : "sort_icon"}></i>
                        </div>
                    </Flex>
                </div>
                <Drawer
                    position="right"
                    className="my-drawer"
                    style={{
                        minHeight: document.documentElement.clientHeight
                    }}
                    sidebar={sidebar}
                    sidebarStyle={{
                        width: 282,
                        backgroundColor: '#ffffff'
                    }}
                    contentStyle={{
                        color: '#A6A6A6',
                        textAlign: 'center',
                        paddingTop: 42
                    }}
                    open={this.state.open}
                    onOpenChange={this.onOpenChange}
                >
                    <div>2</div>
                </Drawer>
                <ListContainer
                    twoLineRow={true}
                    style={{
                        display: this.state.noData ? 'none' : 'block'
                    }}
                    key={this.state.key}
                    ajaxParams={
                        this.state.ajaxParams
                    }
                    listSize={(()=>{
                        if (sessionStorage.getItem('listScrollparams')) {
                            let { hash, fetchParams } = JSON.parse(sessionStorage.getItem('listScrollparams'));
                            if (hash == window.location.hash) {
                                return fetchParams.pageIndex * 20
                            }
                        }
                    })()}
                    listViewWrapHeight={this.state.listHeight}
                    rowTpl={(rowData,rowID, pageIndex) => {
                        return (
                            <GoodsListItem 
                                data={rowData} 
                                key={rowData.productDetailId}
                                scrollContainerClassName={this.state.scrollContainerClassName}
                                fetchParams={this.state.ajaxParams.data}
                                pageIndex={pageIndex}
                                lineType={this.state.lineType}
                            />
                        )
                    }}
                    ajaxData={(rs, pageIndex) => {

                        if (!rs.data.list.length && pageIndex == 1) {
                            this.setState({
                                noData: true
                            })
                        } else {
                            this.setState({
                                noData: false
                            })


                            if (this.state.needGetBrand) {
                                let send_data = {
                                    productId: rs.data.list[0].productId,
                                    access_token: Cookies.get('access_token')
                                }
                                if (commonFn.getUrlAttribute('thirdClassifyID')){
                                    send_data = {
                                        childCategoryId: commonFn.getUrlAttribute('thirdClassifyID'),
                                        access_token: Cookies.get('access_token') || '1352467890bqfy',
                                    } 
                                }
                                fetch(api_host + 'zhbService/mobile/getBrandByCategoryId', { //
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
                                            needGetBrand: false
                                        })
                                        if (data.data && data.data.length) {
                                            let brandArr = [];
                                            data.data.map((b) => {
                                                b.list.map((list_line) => {
                                                    brandArr.push(list_line.name)
                                                })
                                            })

                                            this.setState({
                                                brandList: brandArr
                                            })
                                            
                                        }
                                
                                    })
                            }

                        }
                    }}
                    notNeedRefresh={true}
                    onScroll={(e)=>{
                        if (e.target.scrollTop > 2 * e.target.clientHeight){
                            this.setState({
                                isShowScrollTop: true,
                            })
                        }else{
                            this.setState({
                                isShowScrollTop: false,
                            })
                        }
                    }}
                />
                <div className="noData"
                    style={{
                        display: this.state.noData ? 'block' : 'none',
                        position: 'fixed',
                        top: 38 * document.documentElement.clientWidth / 375,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'url(' + result_img + ') no-repeat center center',
                        backgroundPosition: (149.2 * document.documentElement.clientWidth / 375) + 'px' + ' ' + (60.8 * document.documentElement.clientWidth / 375) + 'px',
                        backgroundSize: '77px 140px'
                    }}
                >
                    <br /><br />暂无匹配的商品
                </div>
                <Popover
                    mask
                    overlayClassName="toplist1"
                    placement="bottom"
                    visible={this.state.list1visible}
                    onVisibleChange={(e) => {
                        if (!e) {
                            this.setState({
                                list1visible: false,
                            })
                        }

                    }}
                    overlay={list1.map((i, index) => {
                        return (
                            <div className={i.val == this.state.ajaxParams.data.orderBy ? "on" : ""} onClick={() => {

                                this.setState({
                                    ajaxParams: {
                                        ...this.state.ajaxParams,
                                        data: {
                                            ...this.state.ajaxParams.data,
                                            orderBy: i.val,
                                            orderType: null
                                        }
                                    }
                                })
                                this.refresh();
                                this.list1visibleChange();
                            }}
                                key={'list1' + index}
                            >{i.txt}
                            </div>)
                    })}
                    style={{
                        top: 0,
                        left: 0
                    }}
                    triggerStyle={{
                        top: 0,
                        left: 0
                    }}
                    overlayStyle={{
                        top: 0,
                        left: 0
                    }}
                    contextStyle={{
                        top: 0,
                        left: 0
                    }}
                ><div></div>
                </Popover>
                <Popover
                    mask
                    overlayClassName="toplist2"
                    placement="bottom"
                    visible={this.state.list2visible}
                    onVisibleChange={(e) => {
                        if (!e) {
                            this.setState({
                                list2visible: false,
                            })
                        }
                    }}
                    overlay={list2.map((i, index) => {
                        return (
                            <div className={i.val == this.state.ajaxParams.data.orderType ? "on" : ""} onClick={() => {
                                this.setState({
                                    ajaxParams: {
                                        ...this.state.ajaxParams,
                                        data: {
                                            ...this.state.ajaxParams.data,
                                            orderBy: '3',
                                            orderType: i.val
                                        }
                                    }
                                })
                                this.refresh();
                                this.list2visibleChange();
                            }}
                                key={'list2' + index}
                            >{i.txt}
                            </div>)
                    })}
                    style={{
                        top: 0,
                        left: 150
                    }}
                    triggerStyle={{
                        top: 0,
                        left: 150
                    }}
                    overlayStyle={{
                        top: 0,
                        left: 150
                    }}
                    contextStyle={{
                        top: 0,
                        left: 150
                    }}
                >
                    <div
                    >
                    </div>
                </Popover>
                {this.state.isShowScrollTop &&
                    <ScrollToTopComponent
                        scrollContainerClassName={this.state.scrollContainerClassName}
                    />
                }

            </div>
        )
    }
}
const categoryGoodsList = createForm()(CategoryGoodsList);
export default categoryGoodsList