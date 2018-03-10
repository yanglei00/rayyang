const React = require('react');
const ReactDOM = require('react-dom');
import { ListView, Checkbox, Button, Toast} from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import Cookies from 'js-cookie';

import commonFn from '../libs/commonfn.js';

import createHistory from 'history/createHashHistory'

import StickyListComponent from '../components/stickyList';
import { ProductListItemComponent, NotDataComponent} from '../components/commonComponent';
import './css/history.less';

const history = createHistory();
class RowTpl extends React.Component {
    state={
        data: this.props.data
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data
        },()=>{
            // console.log(nextProps)
        })
    }
    render(){
        return(
            <div className="history-list-item-container" key={this.props.rowKey}>
                {this.state.data && this.state.data.productList && this.state.data.productList.map((o,i)=>{
                    return (
                        <ProductListItemComponent data={o} key={this.props.rowKey + 'col' + i} colKey={this.props.rowKey + 'col' + i} 
                            onChange={(e)=>{
                                if (this.props.onChange){
                                    this.props.onChange(e, o.browseId,i);
                                }
                            }}
                        />
                    )
                })}

            </div>
        )
    }
}
class HistoryComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowFooterBar: false,
            isShowCheckBox: false,
            lastTime: '',
            isDeteleSuccess: false,
            isAllChecked: false,
            totalSum: 0,
            hasList: true,
            isChecked: false,
            isClickAllCheck: false,
        }
        this.browseIdItems = '',
        this.allBrowserIdItems = '';
    }
    componentDidMount(){
        document.title = '浏览记录'
    }
    deleteHistoryFn (){
        fetch(api_host + 'zhbService/mobile/delBrowsingHistory', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                browseIdItems: this.browseIdItems,
                version: '3.0.0',
                platform: 'WeChat',
            }),
        }).then((rs) => {
            return rs.json();
        })
        .then((rs) => {
            if (rs.errorCode == 0) {
                Toast.info('删除成功')
                this.setState({
                    isDeteleSuccess: true,
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
                this.deleteHistoryFn();
            });
        })
    }
    judgeAllCheck(){
        if (this.browseIdItems && this.browseIdItems.split(',').length == this.allBrowserIdItems.split(',').length){
            this.setState({
                isChecked: true,
                isAllChecked: true
            })
        }else{
            this.setState({
                isChecked: false,
                isAllChecked: false,
            })
        }
    }
    render() {
        return (
            <div className="history-container">
                {this.state.hasList &&   
                    <div className="history-tip">
                        <span className="history-tip-text">共{this.state.totalSum}条，最多为您保存300条</span>
                        <span className="history-tip-eidt" onClick={() => {
                            this.setState({
                                isShowFooterBar: !this.state.isShowFooterBar,
                                isShowCheckBox: !this.state.isShowCheckBox,
                            })
                        }}>{this.state.isShowFooterBar ? '完成' : '编辑'}</span>
                    </div>
                }
                {this.state.hasList &&
                    <StickyListComponent
                        listViewWrapHeight={document.body.clientHeight}
                        ajaxParams={{
                            url: api_host + 'zhbService/mobile/getBrowsingHistory',
                            data: {
                                userId: Cookies.get('uid') || commonFn.getUrlAttribute('uid'),
                                time: this.state.lastTime ? this.state.lastTime : '',
                            },
                            needToken: true,
                            rsDatakey: 'data',
                            rsDataTwoKey: 'list'
                        }}
                        rowTpl={(rowData, sectionId, checkFn) => {
                            if (rowData['productList']) {
                                rowData['productList'].map((o, i) => {
                                    if (this.allBrowserIdItems.indexOf(o.browseId) == -1) {
                                        this.allBrowserIdItems = (!this.allBrowserIdItems ? this.allBrowserIdItems + o.browseId : this.allBrowserIdItems + ',' + o.browseId)
                                    }
                                })
                            }
                            return (
                                <RowTpl data={rowData} rowKey={'row' + sectionId} key={'row' + sectionId} 
                                    onChange={(e, browseId, i) => {
                                        if (e.target.checked) {
                                            this.browseIdItems = (this.browseIdItems.indexOf(browseId) > -1 ? this.browseIdItems : this.browseIdItems + (!this.browseIdItems ? '' : ',') + browseId)
                                            this.judgeAllCheck();
                                            console.log(this.browseIdItems)
                                            checkFn(sectionId, i, true, );
                                        } else {
                                            this.browseIdItems = (() => {
                                                if (this.browseIdItems) {
                                                    if (this.browseIdItems.indexOf(browseId + ',') > -1) {
                                                        return this.browseIdItems.replace(new RegExp(browseId + ',', 'ig'), '')
                                                    } else if (this.browseIdItems.indexOf(',' + browseId) > -1) {
                                                        return this.browseIdItems.replace(new RegExp(',' + browseId, 'ig'), '')
                                                    } else if (this.browseIdItems.indexOf(browseId) > -1) {
                                                        return this.browseIdItems.replace(new RegExp(browseId, 'ig'), '')
                                                    }
                                                } else {
                                                    return '';
                                                }
                                            })();
                                            this.judgeAllCheck();
                                            checkFn(sectionId, i, false);
                                            console.log(this.browseIdItems)

                                        }
                                    }}
                                />
                            )

                        }}
                        ajaxData={(rs, pageIndex) => {
                            let sum = 0;
                            rs.data.list.map((o, i) => {
                                sum = sum + o.productList.length;
                            })
                            this.setState({
                                totalSum: sum,
                            })
                            if (pageIndex == 1) {  //第一页没有数据
                                if (rs.data.length <= 0) {  //空买家秀
                                    this.setState({
                                        hasList: false,
                                    })
                                } else {
                                    this.setState({
                                        hasList: true,

                                    })
                                }
                            }
                            this.setState({
                                isDeteleSuccess: false,

                            })
                        }}
                        onEndReached={(initData) => {
                            let lastTimeFn = () => {
                                let lastTimeCount = 1;
                                let lastTime = initData[initData.length - lastTimeCount]['time'];
                                for (var i = 0; i < initData.length - 1; i++) {
                                    lastTime = initData[initData.length - lastTimeCount]['time'];
                                    if (lastTime) {
                                        return lastTime;
                                    } else {
                                        lastTimeCount = lastTimeCount + 1;
                                    }

                                }
                            }
                            this.setState({
                                lastTime: lastTimeFn()
                            })
                        }}
                        isNeedReload={this.state.isDeteleSuccess}
                        isAllChecked={this.state.isAllChecked}
                        isShowCheckBox={this.state.isShowCheckBox}
                    />
                }
                {this.state.isShowFooterBar &&
                    <div className="history-footer">
                        <div className="history-footer-left">
                            <Checkbox 
                                checked={this.state.isChecked}
                                onChange={(e) => {
                                    this.setState({
                                        isAllChecked : e.target.checked,
                                        isChecked: !this.state.isChecked
                                    }, () => {
                                        // this.state.isAllBrowserIdItems
                                        // console.log(this.allBrowserIdItems)
                                    })
                                    if (e.target.checked){
                                        this.browseIdItems = this.allBrowserIdItems;
                                        console.log(this.browseIdItems)
                                    }else{
                                        this.allBrowserIdItems = '';
                                        this.browseIdItems = '';
                                        console.log(this.browseIdItems)
                                    }
                            }}>全选</Checkbox>
                        </div>
                        <Button
                            className="history-footer-btn"
                            onClick={() => {
                                this.deleteHistoryFn();
                            }}
                        >删除</Button>
                    </div>
                }
                {!this.state.hasList &&
                    <NotDataComponent text="随便逛逛"/>
                }
            </div>
        )
    }
}

export default HistoryComponent;