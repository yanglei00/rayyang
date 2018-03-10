import React from 'react';
import Cookies from 'js-cookie';


import { PullToRefresh, ListView, Button,NavBar,Checkbox,Toast } from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;
import commonFn from '../libs/commonfn';

// import {RowTpl} from '../pages/home';

let pageSize = 10;


class ListContainer extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => {
                if( row1 !== row2 ){
                    // console.log(row1, row2   )
                }
                return row1 !== row2;
            }
        });

        this.initData = [];
        // for (let i = 0; i < 10; i++) {
        //     this.initData.push(`r${i}`);
        // }
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            refreshing: false,
            isLoading: false,
            hasMore:true,

            pageIndex:1,
            goodsCrads:[],
            listKey:1
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
            pageIndex:this.state.pageIndex,
            pageSize:pageSize,
        }
        
        if(this.props.ajaxParams.needToken){ // 需要token
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
            method:'post',
            body: commonFn.urlEncode(send_data),
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
        .then((res) => { return res.json(); })
        .then((response) => {
            if(response.errorCode==-1){
                Toast.info('系统异常');
            }

            let listKey = 'listKey'
            if(this.props.ajaxData){ // 接受数据的回调
                this.props.ajaxData(response, this.state.pageIndex);
            };
            // if (response.errorCode == 0) {

                let rsDataArray = [];
                if(this.props.ajaxParams.rsDataTwoKey){ //data数组里有二级json 数组
                    rsDataArray =  response[this.props.ajaxParams.rsDatakey][this.props.ajaxParams.rsDataTwoKey]
                }else{
                    rsDataArray = response[this.props.ajaxParams.rsDatakey];
                }
                console.log(rsDataArray)
                if(rsDataArray && rsDataArray.length > 0){ // 有数据
        
                    let goods_list_json = typeof rsDataArray == 'string' ? JSON.parse(rsDataArray) : rsDataArray;
                    if(this.props.twoLineRow){  // 转化数据为二维数据
                        
                        if(goods_list_json.length> 0){
                             // 一维数组 转化成二维数组
                            function formatData(arr) {
                                var tempArr = [];
                                for (var i = 0; i < Math.ceil(arr.length/2); i++) {
                                    tempArr[i] = [];
                                    tempArr[i].push(arr[2*i]);
                                    tempArr[i].push(arr[2*i+1]);
                                }
                                return tempArr;
                            }
                            goods_list_json = formatData(goods_list_json);
                        }
                    }
                    
                    if(type == 'refresh'){ //下拉刷新
                        this.initData = [...goods_list_json, ...this.initData];
                        listKey = new Date().getTime();
                    }else{ //上来加载更多

                        this.initData = [...this.initData,...goods_list_json ];

                    };
                    let isHasMore = true;
                    if( rsDataArray.length < send_data.pageSize || send_data.pageIndex == response.totalPage ){
                        isHasMore = false;
                    }
                    this.setState({
                        hasMore: isHasMore,
                        listKey:listKey,
                        dataSource: this.state.dataSource.cloneWithRows(this.initData),
                        isLoading : false,
                        refreshing: false,
                        pageIndex : this.state.pageIndex + 1
                    });
                    
                    console.log(this.state.dataSource)
                }else{ // 无数据
                    this.setState ({
                        isLoading : false,
                        hasMore : false,
                        refreshing: false
                    });
                }

                if( this.props.loadedFun ){
                    this.props.loadedFun(this.props.initKey);
                }
            
        })
        .catch((e) => { 
            document.write(e)	
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
        if (this.state.isLoading || !this.state.hasMore) {
            return;
        };

        // console.log('end')
        this.ajaxGoodsFun();

    }


    componentWillReceiveProps(nextProps){
        if(this.props.scrollToTop){


            this.refs.ListView.scrollTo(0,0,true)
        }
        if(nextProps.noNetworkClick){ // 无网
            this.ajaxGoodsFun()
        }
        
    }
    //刷新
    onRefresh = () => {
        if( this.state.refreshing ){
            return false;
        }
        setTimeout(()=>{

            this.setState({
                refreshing: true,
                pageIndex:1,
            },()=>{
                this.initData = [];
                this.ajaxGoodsFun('refresh');
            })

        },1000)
        //     return;
        // }

        
    }
    // 滚动
    onScroll(e){

        if(this.props.onScroll && e.scroller){
            if(this.state.isLoading){
                return
            }
            if(e.scroller.__scrollTop >= 2 * e.scroller.__clientHeight){ //大于2屏幕内容
                this.props.onScroll(true,this.props.initKey);

            }else{
                this.props.onScroll(false,this.props.initKey);
                
            }
        };
    }
    //渲染一行方法
    renderRowFunc = (rowData, sectionID, rowID) => {
        return (
            <div key={rowID} className="row-container" >
                {this.props.rowTpl(rowData,rowID)}
            </div>
        );
    }


    render() {
        
        return (
            <div className={`list-view-container`}>
                <ListView
                  ref="ListView"
                  useBodyScroll={false}
                  key={this.state.listKey }
                  dataSource={this.state.dataSource}
                  renderHeader={()=>(
                      this.props.renderHeader? this.props.renderHeader(): <div></div>
                  )}
                  renderFooter={() => (<div style={{
                      padding: 30,
                      textAlign: 'center',
                      display: (this.state.hasMore &&  this.state.isLoading) ? 'block': 'none'  
                   }}>
                    {this.state.isLoading ? '加载中...' : ''}
                  </div>)}
                  renderRow={this.renderRowFunc}
                  initialListSize={this.props.listSize||20}
                  pageSize={this.props.pageSize||20}
                  scrollRenderAheadDistance={100}
                  scrollEventThrottle={500}
                  onEndReached={this.onEndReached}
                  onEndReachedThreshold={10}
                  style={{
                    height: this.props.listViewWrapHeight? this.props.listViewWrapHeight: document.body.clientHeight-76,
                  }}
                  contentContainerStyle={{ position: 'relative' }}
                  scrollerOptions={{ scrollbars: true }}
                  onScroll ={this.onScroll.bind(this)}

                  pullToRefresh={this.props.hasReFresh?
                    <PullToRefresh
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh}
                      indicator={{ deactivate: '下拉' }}
                    />:''
                  }
                />
          </div>
        );
    }
}




export default ListContainer;
