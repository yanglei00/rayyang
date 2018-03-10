
const React = require('react');
const ReactDOM = require('react-dom');
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import Cookies from 'js-cookie';
import { PullToRefresh, Flex, Toast, Modal, Drawer, List, InputItem, Popover } from 'antd-mobile';
const Item = Popover.Item;
import ListContainer from '../components/listContainer';
import { createForm } from 'rc-form';
// import Progess from './progess.js';
// import { appFunc } from './../libs/appfuncs.js'
const alert = Modal.alert;
import { Redirect } from 'react-router-dom';
import createHistory from 'history/createHashHistory'
const history = createHistory()
import { Link } from 'react-router-dom';
import './css/list.less';
import result_img from './img/search_result.png'
class GoodsListItem extends React.Component {
    render() {
        let line_data = this.props.data;
        let _key = this.props.data.productDetailId;
        return (
            <div onClick={() => {
                appFunc.toAppProductDetail({
                    productDetailId: line_data.productDetailId,
                    productId: line_data.productId
                })
            }
            } key={_key + '1'}>      {(line_data.colors > 1 ? <em>{line_data.colors + '色可选'}</em> : '')}
                <img src={line_data.productPicture} alt="" />
                <div className="goodTitle">{line_data.productTitle}</div>
                <div className="tags">{line_data.tags.map((ii, kk) => (<span key={kk}>{ii}</span>))}</div>
                <div className="name">{line_data.productName}</div>
                <div className="price"><span>{'￥' + line_data.price}</span><span>{line_data.oldPrice && '￥' + line_data.oldPrice}</span></div>
            </div>
        )
    }
}


class HalfOffDetailForm extends React.Component {
    state = {
        userId: Cookies.get('uid'),
        token: Cookies.get('access_token'),
        data: [],
        ajaxParams: {
            url: api_host + 'zhbService/mobile/brandHalfOff',
            // url: '../../mock/list.json',
            data: {
                version: '3.0.2',
                platform: 'mSite',
                access_token: Cookies.get("access_token") || '1352467890bqfy',
                pageSize: 20,
                priceBegin: "",
                priceEnd: "",
                brandName: "",
                orderRule: null,
                priceTag: null,
            },
            rsDataTwoKey: 'productList',
            rsDatakey: 'data'
        },
        noData: false,
        open: false,
        list1visible: false,
        list2visible: false
    }
    componentWillMount() {
        document.title = "品牌五折专区";
        appFunc.navigationBarUpdated('品牌五折专区', '0');
    }
    inputChange = () => {
        if (this.props.form.getFieldValue('priceBegin') && this.props.form.getFieldValue('priceEnd') && (~~this.props.form.getFieldValue('priceBegin') > ~~this.props.form.getFieldValue('priceEnd'))) {
            this.props.form.setFieldsValue({
                priceBegin: this.props.form.getFieldValue('priceEnd'),
                priceEnd: this.props.form.getFieldValue('priceBegin'),
            })
            this.setState({
                ajaxParams: {
                    ...this.state.ajaxParams,
                    data: {
                        ...this.state.ajaxParams.data,
                        priceBegin: this.props.form.getFieldValue('priceBegin'),
                        priceEnd: this.props.form.getFieldValue('priceEnd'),
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
        appFunc.navigationBarUpdated('品牌五折专区', '11');
        this.setState({
            ajaxParams: {
                ...this.state.ajaxParams,
                data: {
                    ...this.state.ajaxParams.data,
                    priceBegin: this.props.form.getFieldValue('priceBegin'),
                    priceEnd: this.props.form.getFieldValue('priceEnd'),
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
    render() {
        const popover1 = (<div></div>);
        const popover2 = (<div></div>);
        const list1 = ["综合排序", "销量排序"];
        const list2 = ["从低到高", "从高到低"];
        const { getFieldProps } = this.props.form;
        const sidebar = (<div>
            <div className="pricegrid">
                <div className="drawer-title">
                    价格区间
                </div>
                <div className="priceInput">
                    <Flex>
                        <Flex.Item>
                            <InputItem
                                {...getFieldProps('priceBegin', {
                                }) }
                                id="priceBegin"
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
                                                priceBegin: this.props.form.getFieldValue('priceBegin'),
                                                priceEnd: this.props.form.getFieldValue('priceEnd'),
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex.Item>
                        <div className="devide">-</div>
                        <Flex.Item>
                            <InputItem
                                {...getFieldProps('priceEnd', {
                                }) }
                                id="priceEnd"
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
                                                priceBegin: this.props.form.getFieldValue('priceBegin'),
                                                priceEnd: this.props.form.getFieldValue('priceEnd'),
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
                                    this.state.ajaxParams.data.brandName == i ? this.setState({
                                        ajaxParams: {
                                            ...this.state.ajaxParams,
                                            data: {
                                                ...this.state.ajaxParams.data,
                                                brandName: ""
                                            }
                                        }
                                    }) : this.setState({
                                        ajaxParams: {
                                            ...this.state.ajaxParams,
                                            data: {
                                                ...this.state.ajaxParams.data,
                                                brandName: i
                                            }
                                        }
                                    })
                                }}
                                className={this.state.ajaxParams.data.brandName == i ? 'on' : ''}
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
                                brandName: "",
                                priceBegin: "",
                                priceEnd: "",
                            }
                        }
                    })
                    this.props.form.setFieldsValue({
                        priceBegin: "",
                        priceEnd: "",
                    })
                }}>重置</a>
                <a onClick={this.onOpenChangeStatus}>确认</a>
            </div>
        </div>);
        return (
            <div className='brandHalfOff'>
                <div className="topbar" >
                    <Flex>
                        <Flex.Item className={this.state.ajaxParams.data.orderRule ? "colored" : ""} onClick={this.list1visibleChange}>{list1[this.state.ajaxParams.data.orderRule - 1] ? list1[this.state.ajaxParams.data.orderRule - 1] : "推荐"}<i className={this.state.list1visible ? (this.state.ajaxParams.data.orderRule ? "down" : "up") : ""}></i></Flex.Item>
                        <Flex.Item className={this.state.ajaxParams.data.priceTag ? "colored" : ""} onClick={this.list2visibleChange}>{list2[this.state.ajaxParams.data.priceTag - 1] ? list2[this.state.ajaxParams.data.priceTag - 1] : "价格"}<i className={this.state.list2visible ? (this.state.ajaxParams.data.priceTag ? "down" : "up") : ""}></i></Flex.Item>
                        <Flex.Item onClick={() => {
                            this.onOpenChange()
                        }}>筛选<i className="select_icon"></i>
                        </Flex.Item>
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
                    style={{
                        display: this.state.noData ? 'none' : 'block'
                    }}
                    key={this.state.key}
                    ajaxParams={
                        this.state.ajaxParams
                    }
                    listViewWrapHeight={document.body.clientHeight - 38 * document.documentElement.clientWidth / 375}
                    rowTpl={(rowData) => {
                        return (
                            <GoodsListItem data={rowData} key={rowData.productDetailId} />
                        )
                    }}
                    ajaxData={(rs, pageIndex) => {
                        rs.data.brandList.length && this.setState({
                            brandList: rs.data.brandList
                        })
                        if (!rs.data.productList.length && pageIndex == 1) {
                            this.setState({
                                noData: true
                            })
                        } else {
                            this.setState({
                                noData: false
                            })
                        }
                    }}
                    notNeedRefresh={true}
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
                    暂无匹配的商品
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
                            <div className={index === this.state.ajaxParams.data.orderRule - 1 ? "on" : ""} onClick={() => {
                                console.log(i)
                                this.setState({
                                    ajaxParams: {
                                        ...this.state.ajaxParams,
                                        data: {
                                            ...this.state.ajaxParams.data,
                                            orderRule: index + 1,
                                            priceTag: null
                                        }
                                    }
                                })
                                this.refresh();
                                this.list1visibleChange();
                            }}
                                key={'list1' + index}
                            >{i}
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
                            <div className={index === this.state.ajaxParams.data.priceTag - 1 ? "on" : ""} onClick={() => {
                                this.setState({
                                    ajaxParams: {
                                        ...this.state.ajaxParams,
                                        data: {
                                            ...this.state.ajaxParams.data,
                                            orderRule: null,
                                            priceTag: index + 1
                                        }
                                    }
                                })
                                this.refresh();
                                this.list2visibleChange();
                            }}
                                key={'list2' + index}
                            >{i}
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


            </div>
        )
    }
}
const HalfOffDetail = createForm()(HalfOffDetailForm);
export default HalfOffDetail