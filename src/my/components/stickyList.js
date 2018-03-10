import React from 'react';
import Cookies from 'js-cookie';


import { ListView, Checkbox} from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

const CheckboxItem = Checkbox.CheckboxItem;
import commonFn from '../libs/commonfn';

let pageSize = 20;


class StickyListComponent extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => {
                // if (row1 !== row2) {
                //     console.log(row1, row2   )
                // }
                return row1 !== row2 || row1 == row2;
            },
            sectionHeaderHasChanged: (s1, s2)=>{
                // if (s1 !== s2){

                // }
                return s1 !== s2|| s1 == s2; // 全部返回
            },
            getRowData: (dataBlob, sectionId, rowId)=>{
                return dataBlob[sectionId]
            },
            getSectionHeaderData: (dataBlob, sectionId) =>{
                return dataBlob[sectionId]
            }
        });

        this.initData = [];
        // for (let i = 0; i < 10; i++) {
        //     this.initData.push(`r${i}`);
        // }
        this.isClickCheck = false;
        this.state = {
            dataSource: dataSource.cloneWithRowsAndSections(this.initData),
            refreshing: false,
            isLoading: false,
            hasMore: true,

            pageIndex: 1,
            goodsCrads: [],
            listKey: 1,
            isLastTime: '',
            isAllChecked: this.props.isAllChecked,
            isShowCheckBox: this.props.isShowCheckBox,
            
        };
    }
    componentDidMount() {
        //Cookies.remove('name');
        // if( !Cookies.get('access_token') ){
        //     // commonFn.getNewToken({},(rs) => {

        //     //     Cookies.set('access_token', rs.newToken, { expires: 3, path: '/' });
        //     //     this.ajaxGoodsFun();
        //     // });
        // }else{
        //     this.ajaxGoodsFun();
        // }
        this.ajaxGoodsFun();
    }
    ajaxGoodsFun = (type) => {
        this.setState({ isLoading: true });


        let send_data = {
            pageIndex: this.state.pageIndex,
            pageSize: pageSize,
        }

        if (this.props.ajaxParams.needToken) { // 需要token
            send_data = {
                ...send_data,
                access_token: Cookies.get('access_token')
            }
        }
        // if(this.props.ajaxAloneParams){ //单独的ajax参数
        //     send_data = this.props.ajaxAloneParams;
        // }else{
        //     send_data = Object.assign({}, send_data, this.props.ajaxParams.data);
        // }
        let propsData = this.props.ajaxParams.data;
        send_data = {
            ...send_data,
            ...propsData
        }
        fetch(this.props.ajaxParams.url, {
            method: 'post',
            body: commonFn.urlEncode(send_data),
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((res) => { return res.json(); })
            .then((response) => {
                if (response.errorCode == -1) {
                    Toast.info('系统异常');
                }

                let listKey = 'listKey'
                if (this.props.ajaxData) { // 接受数据的回调
                    this.props.ajaxData(response, this.state.pageIndex);
                };
                // if (response.errorCode == 0) {

                let rsDataArray = [];
                if (this.props.ajaxParams.rsDataTwoKey) { //data数组里有二级json 数组
                    rsDataArray = response[this.props.ajaxParams.rsDatakey][this.props.ajaxParams.rsDataTwoKey]
                } else {
                    rsDataArray = response[this.props.ajaxParams.rsDatakey];
                }
                // console.log(rsDataArray)
                // console.log()
                if (rsDataArray && rsDataArray.length > 0) { // 有数据

                    let goods_list_json = typeof rsDataArray == 'string' ? JSON.parse(rsDataArray) : rsDataArray;
                    if (this.props.twoLineRow) {  // 转化数据为二维数据

                        if (goods_list_json.length > 0) {
                            // 一维数组 转化成二维数组
                            function formatData(arr) {
                                var tempArr = [];
                                for (var i = 0; i < Math.ceil(arr.length / 2); i++) {
                                    tempArr[i] = [];
                                    tempArr[i].push(arr[2 * i]);
                                    tempArr[i].push(arr[2 * i + 1]);
                                }
                                return tempArr;
                            }
                            goods_list_json = formatData(goods_list_json);
                        }
                    }

                    if (type == 'refresh') { //下拉刷新
                        this.initData = [...goods_list_json, ...this.initData];
                        listKey = new Date().getTime();
                    } else { //上来加载更多
                        this.initData = [...this.initData, ...goods_list_json];
                    };
                    //  修改合并数据源 
                    this.initData.map((o, i)=>{
                        if(!o.time){
                            this.initData[i - 1]['productList'] = [...this.initData[i - 1]['productList'], ...this.initData[i]['productList']];
                            this.initData = [...this.initData.slice(0, i), ...this.initData.slice(i+1)];
                        }
                    })
                    // 增加是否选中的字段
                    this.initData.map((o, i)=>{
                        o['productList'].map((o,i)=>{
                            if(typeof o.isShowCheckBox == 'undefined'){
                                return Object.assign(o, { isShowCheckBox: this.state.isShowCheckBox, isAllChecked: false, isChecked: false})
                            }else{
                                return o;
                            }
                        })
                    })
                    this.setState({
                        hasMore: true,
                        listKey: listKey,
                        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.initData),
                        isLoading: false,
                        refreshing: false,
                        pageIndex: this.state.pageIndex + 1
                    });

                } else { // 无数据
                    this.setState({
                        isLoading: false,
                        hasMore: false,
                        refreshing: false
                    });
                }

                if (this.props.loadedFun) {
                    this.props.loadedFun(this.props.initKey);
                }

            })
            .catch((e) => {
                commonFn.getNewToken({
                    uid: Cookies.get('uid'),
                }, (rs) => {
                    this.ajaxGoodsFun();
                });
            });

    }
    // 拉到底部 加载数据
    onEndReached = (event) => {
        // 到达底部
        // if(event){
        //
        //     // console.log(event.scroller.__scrollTop == 0)
        //     if(event.scroller.__scrollTop == 0){
        //         console.log('ok')
        //         this.props.onTopReached(true);
        //     }
        // }
        // console.log(this.state)
        if (this.state.isLoading || !this.state.hasMore) {
            return;
        };

        // console.log('end')
        if (this.props.onEndReached){
            this.props.onEndReached(this.initData);
        }
        let lastTimeFn = () => {
            let lastTimeCount = 1;
            let lastTime = this.initData[this.initData.length - lastTimeCount]['time'];
            for (var i = 0; i < this.initData.length - 1; i++) {
                lastTime = this.initData[this.initData.length - lastTimeCount]['time'];
                if (lastTime) {
                    return lastTime;
                } else {
                    lastTimeCount = lastTimeCount + 1;
                }

            }
        }
        this.setState({
            isLastTime: lastTimeFn()
        })
        this.ajaxGoodsFun();
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.scrollToTop) {


            this.refs.ListView.scrollTo(0, 0, true)
        }
        if (nextProps.noNetworkClick) { // 无网
            this.ajaxGoodsFun()
        }
        if (nextProps.isNeedReload) {
            this.ajaxGoodsFun();
        }
        this.setState({
            isAllChecked: nextProps.isAllChecked,
            isShowCheckBox: nextProps.isShowCheckBox
        })
        
        if (!this.isClickCheck) {
            this.initData.map((o, i) => {
                o['productList'].map((o, i) => {
                    return Object.assign(o, { isShowCheckBox: nextProps.isShowCheckBox, isAllChecked: nextProps.isAllChecked, isChecked: nextProps.isAllChecked })

                })
            })
        }else{
            this.initData.map((o, i) => {
                o['productList'].map((o, i) => {
                    return Object.assign(o, { isShowCheckBox: nextProps.isShowCheckBox,})

                })
            })
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(this.initData),
        });
        console.log(this.initData)
        console.log(22)

        this.isClickCheck = false;
        
    }
    checkFn = (row,col,checked)=>{
        this.isClickCheck = true;
        console.log(row,col,checked)
        console.log(this.initData[row]['productList'][col])
        if(checked == false){// 不勾选
            this.setState({
                isAllChecked: false
            })
            this.initData = [
                ...this.initData.slice(0, row),
                Object.assign({}, this.initData[row], {
                    productList: [
                        ...this.initData[row]['productList'].slice(0, col),
                        Object.assign({}, this.initData[row]['productList'][col], { isChecked: checked, isAllChecked: false}),
                        ...this.initData[row]['productList'].slice(col + 1)
                    ]
                }),
                ...this.initData.slice(row + 1)
            ]
        }else{
            this.initData = [
                ...this.initData.slice(0, row),
                Object.assign({}, this.initData[row], {
                    productList: [
                        ...this.initData[row]['productList'].slice(0, col),
                        Object.assign({}, this.initData[row]['productList'][col], { isChecked: checked, }),
                        ...this.initData[row]['productList'].slice(col + 1)
                    ]
                }),
                ...this.initData.slice(row + 1)
            ]
        }
        console.log(this.initData)
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(this.initData),
        });
        console.log(33)
    }
    //刷新
    onRefresh = () => {
        if (this.state.refreshing) {
            return false;
        }
        setTimeout(() => {

            this.setState({
                refreshing: true,
                pageIndex: 1,
            }, () => {
                this.initData = [];
                this.ajaxGoodsFun('refresh');
            })

        }, 1000)
        //     return;
        // }


    }
    // 滚动
    onScroll(e) {
        if (this.props.onScroll && e.scroller) {
            if (this.state.isLoading) {
                return
            }
            if (e.scroller.__scrollTop >= 2 * e.scroller.__clientHeight) { //大于2屏幕内容
                this.props.onScroll(true, this.props.initKey);

            } else {
                this.props.onScroll(false, this.props.initKey);

            }
        };
    }
    //渲染一行方法
    renderRowFunc = (rowData, sectionID, rowID) => {
        // console.log(rowData)
        // console.log(sectionID)
        // console.log(rowID)
        console.log(11)
        if(rowID == 'productList'){
            return (
                <div key={'row productList' + sectionID} className="row-container">
                    {this.props.rowTpl(rowData, sectionID,this.checkFn)}
                </div>
            );
        }else{
            return null;
        }
    }


    render() {
        console.log(this.state.isAllChecked)
        return (
            <div className={`list-view-container`}>
                <ListView
                    ref="ListView"
                    key={this.state.listKey}
                    dataSource={this.state.dataSource}
                    renderHeader={() => (
                        this.props.renderHeader ? this.props.renderHeader() : <div></div>
                    )}
                    renderFooter={() => (<div style={{
                        padding: 30,
                        textAlign: 'center',
                        display: (this.state.hasMore && this.state.isLoading) ? 'block' : 'none'
                    }}>
                        {this.state.isLoading ? '加载中...' : ''}
                    </div>)}
                    renderRow={this.renderRowFunc.bind(this)}
                    initialListSize={this.props.listSize || 20}
                    pageSize={this.props.pageSize || 20}
                    scrollRenderAheadDistance={100}
                    scrollEventThrottle={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    style={{
                        height: this.props.listViewWrapHeight ? this.props.listViewWrapHeight : document.body.clientHeight,
                        overflow: 'auto',
                    }}
                    
                    scrollerOptions={{ scrollbars: true }}
                    onScroll={this.onScroll.bind(this)}

                    pullToRefresh={this.props.hasReFresh ?
                        <PullToRefresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            indicator={{ deactivate: '下拉' }}
                        /> : ''
                    }
                    renderSectionWrapper={(sectionID) => {
                        return (
                            <StickyContainer
                                key={`s_${sectionID}_c`}
                                className={'sticky-container'}
                                style={{ zIndex: 4 }}
                            />
                        )
                    }}
                    renderSectionHeader={(sectionData, sectionID) => {
                        if (sectionData.time){
                            return (
                                <Sticky topOffset={-40}>
                                    {({
                                        style,
                                        isSticky,
                                        distanceFromTo,
                                        distanceFromBottom
                                    }) =>{
                                        // console.log(distanceFromTo, distanceFromBottom)
                                        return (
                                            <div
                                                className={'sticky'}
                                                style={{
                                                    ...style,
                                                    zIndex: 3,
                                                    top: '.85rem',
                                                }}
                                            >{sectionData.time}</div>
                                        )
                                    }}
                                </Sticky>
                            )
                        }
                    }}
                />
            </div>
        );
    }
}




export default StickyListComponent;
