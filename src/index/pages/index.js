const React = require('react');

import { Carousel,Tabs,Flex  } from 'antd-mobile';
import _ from 'underscore';

import Cookies from 'js-cookie';

import appfuncs from '../../libs/appfuncs';
import commonFn from '../../libs/commonfn';
import createHistory from 'history/createHashHistory'
const history = createHistory();

import { StickyContainer, Sticky } from 'react-sticky';
import { PintuanItemComponent,SearchBarComponent,ScrollToTopComponent,GoodsListItemComponent,TwoLineGoodsListItemComponent } from '../../components/commonComponent';

import ListContainer from '../../components/listContainer';


import './css/index.less';
import '../../components/css/commonComponent.less';

const tabs = [];
let currentTime = '';
var MyMar = null;

function renderTabBar(props) {
  return (<Sticky topOffset={0}>
    {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
  </Sticky>);
}

export class MiaoShaItemComponent extends React.Component {
    render() {
        const o = this.props.data;
        return (
            <div className="goods-list-item-container" onClick={() => {
                    appfuncs.toAppProductDetail({
                        productId: o.productId,
                        productDetailId: o.productDetailId
                    });
                }}>
                <dl >
                    <dt>
                        <img src={o.pic1url} alt="" />
                    </dt>
                    <dd>
                        <p style={{display:'none'}}></p>
                        <p style={{display:'none'}}></p>
                        <p>{o.name}</p>
                        <p><span>¥{o.price}</span>{o.oldprice && o.oldprice != o.price ? <span>¥{o.oldprice}</span> : ''}</p>
                    </dd>
                </dl>
            </div>
        )
    }
}



export class OnePageComponent extends React.Component {
        state = {
            bannarData:false,
            noticeList:false,
            iconsArr : false,

        time_tabs:[],
        timeInfo:'时间',
        time_goods:[],
        
        tabs_state:'1',
        end_start_time:'',
        seckillTitle:'',
        pintuanTitle:'',
        pintuanArr:[],

        topGoodsArr:[],
        bannerData:[],
        choiceData:false,
        }
        sliceArray = (array, size) => {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(array.slice(start, end));
            }
            return result;
        }   
        componentWillMount() {
            let indexData = this.props.indexData;
            if(!indexData){
                return
            }

            //双列表  每日上新
            let pageData = indexData[_.findLastIndex(indexData, {type: '6'})];
            {pageData.data.map((val,key)=>{
                val.productsubname = val.title;
            })}
            if (pageData.data.length > 0) {
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
                indexData[_.findLastIndex(indexData, {type: '6'})].data = formatData(pageData.data)
            }



            let killIndex = _.findIndex(indexData, {type: '2'});
            this.setState({
                bannarData:indexData[_.findLastIndex(indexData, {type: '8'})].data,
                noticeList:indexData[_.findLastIndex(indexData, {type: '9'})].data,
                iconsArr:this.sliceArray( indexData[_.findLastIndex(indexData, {type: '1'})].data,5 ),
                seckillTitle:indexData[killIndex].title.title,
                time_tabs:indexData[killIndex].data,
                tabs_state:indexData[killIndex].data[0].status,
                end_start_time:indexData[killIndex].data[0].endTime,
                time_goods:indexData[killIndex].data[0].productList,

                pintuanTitle:indexData[_.findLastIndex(indexData, {type: '12'})].title.title,
                pintuanArr:indexData[_.findLastIndex(indexData, {type: '12'})].data,

                topTitle:indexData[_.findLastIndex(indexData, {type: '3'})].title.title,
                topGoodsArr:indexData[_.findLastIndex(indexData, {type: '3'})].data,
                
                bannerHref:indexData[_.findLastIndex(indexData, {type: '4'})].title.moreUrl,
                bannerTitle:indexData[_.findLastIndex(indexData, {type: '4'})].title.title,
                bannerData:indexData[_.findLastIndex(indexData, {type: '4'})].data,

                choiceData:indexData[_.findLastIndex(indexData, {type: '5'})],
                newDateGoods:indexData[_.findLastIndex(indexData, {type: '6'})]
            },()=>{
                currentTime = this.state.time_tabs[0].currentTime;
                this.countTime()
                setInterval( ()=>{
                    currentTime = Number(currentTime)+1000;
                     this.countTime()
                }, 1000);

                this.state.time_tabs.map((val,key)=>{
                    val.title = <div key={key} className="time_detil"><p>{val.startTime}</p><p className="time_txt">{val.title}</p><i></i></div>
                })
            })
            

        }
        componentWillUnmount() {
            if (MyMar) {
                clearInterval(MyMar)
            }
        }
        ScrollImgLeft = () => {
            var speed = 16;
            clearInterval(MyMar)
            var scroll_begin = this.refs.scroll_begin;
            var scroll_end = this.refs.scroll_end;
            var scroll_div = this.refs.scroll_div;
            // scroll_end.innerHTML=scroll_begin.innerHTML; 
            function Marquee() {
                if (scroll_end.offsetWidth - scroll_div.scrollLeft <= 0)
                    scroll_div.scrollLeft -= scroll_begin.offsetWidth;
                else {
                    scroll_div.scrollLeft++;
                }
            }
            MyMar = setInterval(Marquee, speed);


        }
        componentDidMount() {
            if (this.refs.scroll_end) {
                setTimeout(() => {
                    if (this.state.noticeList.length == 1) {
                        var scroll_begin = this.refs.scroll_begin;
                        var scroll_end = this.refs.scroll_end;
                        var scroll_div = this.refs.scroll_div;
                        if (scroll_end.offsetWidth < scroll_div.offsetWidth) {
                            scroll_end.style.width = scroll_div.offsetWidth + 'px';
                            scroll_begin.style.width = scroll_div.offsetWidth + 'px';
                        }
                    }
                    this.ScrollImgLeft();
                }, 1000)
            }
        }
        timeTabsChange = (tab,index) => {
            this.setState({
                tabs_state:tab.status,
                end_start_time:tab.endTime,
                time_goods:tab.productList
            },()=>{
                this.countTime();
            })
        }
        countTime=(state, time) =>{
            var now = currentTime;
            var state_txt = '';
            if( this.state.tabs_state == "3" ){
                //即将开枪
                state_txt = '距本场开始';
            }else if( this.state.tabs_state == "2" ){
                //秒杀
                state_txt = '距本场结束';
            }else{
                this.setState({
                    timeInfo:'本场已结束 下次赶早'
                })
                return false;
            }
            //设置截止时间
            var leftTime = this.state.end_start_time - now;

            //定义变量 d,h,m,s保存倒计时的时间
            var d = 0,
                h = 0,
                m = 0,
                s = 0;
            if(leftTime >= 0) {
                d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                if(d){
                    h = d*24 + h
                }
                if(parseInt(h) < 10) {
                    
                    h = '0' + h;
                } else {
                    h = h;
                };

                if(parseInt(m) < 10) {
                    m = '0' + m;
                } else {
                    m = m;
                };
                if(parseInt(s) < 10) {
                    s = '0' + s;
                } else {
                    s = s;
                };
                
                this.setState({
                    timeInfo:state_txt +' '+ h + ":" + m + ":" + s
                })

            } else {
                d = 0;
                h = 0;
                m = 0;
                s = 0;
                this.setState({
                    timeInfo:'本场已结束 下次赶早'
                })
            }
        }

        clickBannar = (linkData)=>{
            if( linkData ){
                let linkDataJson = JSON.parse(linkData.split('openby:zhbservice=')[1]);
                if( linkDataJson.params.linkUrl ){
                    linkDataJson.params.linkUrl += (linkDataJson.params.linkUrl.indexOf('?') > -1 ?'&':'?') + '?uid=' + (Cookies.get("uid")||'') + '&mobile=' + (Cookies.get('mobile')||'');
                }
                appfuncs.gotoAppUrlFormat( 'openby:zhbservice=' + JSON.stringify(linkDataJson) );
            }

        }
        clickIconFn = (linkData)=>{
            
            let linkDataJson = JSON.parse(linkData.split('openby:zhbservice=')[1]);
            if( linkDataJson.params.type == '1' || linkDataJson.params.type == '2' ){
                if( Cookies.get("uid") ){
                    if( linkDataJson.params.linkUrl ){
                        linkDataJson.params.linkUrl += (linkDataJson.params.linkUrl.indexOf('?') > -1 ?'&':'?') + '?uid=' + (Cookies.get("uid")||'') ;
                    }
                }else{
                    window.location.href = url_host+'mSite/views/login/login.html?goto=../index/index.html';
                    return
                }
            }else{
                if( linkDataJson.params.isLogin && linkDataJson.params.isLogin == 'Y' ){
                    if( Cookies.get("uid") ){
                        if( linkDataJson.params.linkUrl ){
                            linkDataJson.params.linkUrl += (linkDataJson.params.linkUrl.indexOf('?') > -1 ?'&':'?') + '?uid=' + (Cookies.get("uid")||'') ;
                        }
                    }else{
                        window.location.href = url_host+'mSite/views/login/login.html?goto=../index/index.html';
                        return
                    }
                }
            }
            appfuncs.gotoAppUrlFormat( 'openby:zhbservice=' + JSON.stringify(linkDataJson) );

        }
         
        render() {
            return (
                <div>
                    <Carousel
                      autoplay={false}
                      infinite
                      selectedIndex={0}
                    >
                      {this.state.bannarData && this.state.bannarData.map( (val,key )=> {
                        return(
                          <img
                            src={val.imageUrl}
                            alt={val.title}
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onClick={() => {
                                this.clickBannar(val.linkUrl)
                            }}
                          />
                        )
                      })}
                    </Carousel>

                    <div className="notice">
                        <div className="am-notice-bar">
                            <div className="am-notice-bar-icon"></div>
                            <div className="am-notice-bar-content notice_box">
                                <div className="am-notice-bar-marquee-wrap">
                                    <div ref="scroll_div" className="scroll_div fl">
                                        <div ref="scroll_begin" className="scroll_begin">
                                        {
                                            this.state.noticeList && this.state.noticeList.map((ii, nkey) => (
                                                <span className="pad_right" key={nkey} onClick={()=>{

                                                    history.push( 'buyerOrderDetail?orderId='+ii.orderId+'&productId='+ii.productId+'&productDetailId='+ii.productDetailId );

                                                }}><i>{ ii.brandName }</i>{ii.productName+' '+ii.mobileNumber+' '+ii.orderTime+ii.successTip} &yen;{ii.price+' '+ ii.buyerNumber}已买</span>
                                            ))
                                        }
                                        </div>
                                        <div ref="scroll_end" className="scroll_end">
                                            {
                                                this.state.noticeList && this.state.noticeList.map((ii, nkey) => (
                                                    <span className="pad_right" key={nkey} onClick={()=>{

                                                        history.push( 'buyerOrderDetail?orderId='+ii.orderId+'&productId='+ii.productId+'&productDetailId='+ii.productDetailId );

                                                    }}><i>{ ii.brandName }</i>{ii.productName+' '+ii.mobileNumber+' '+ii.orderTime+ii.successTip} &yen;{ii.price+' '+ ii.buyerNumber}已买</span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    

                    {this.state.iconsArr && this.state.iconsArr.map((val,key)=>{
                        return(
                            <Flex className="bannerList" key={key}>
                                {val.map((ival,ikey)=>{
                                    return(
                                        <Flex.Item key={ikey}>
                                            <div className="func" onClick={() => {
                                                this.clickIconFn(ival.linkUrl);
                                            }}>
                                                <i><img src={ival.imageUrl} alt=""/></i>
                                                <span>{ival.title}</span>
                                            </div>
                                        </Flex.Item>
                                    )
                                })}
                            </Flex>
                        )
                    })}
                    


                    <div className="times_line borderTop5">
                        <div className="home_title"><span className="txt">{this.state.seckillTitle}</span></div>

                        <div className="ms_tabs" style={{display:'none'}}>
                            <Carousel
                              autoplay={false}
                              infinite={false}
                              slideWidth={0.2}
                              dots={false}
                              selectedIndex={this.state.selectedIndex}
                              beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                              afterChange={index => console.log('slide to', index)}
                            >
                              {this.state.time_tabs.map( (val,key) => (
                                <a
                                  key={key}
                                  onClick={()=>{
                                    this.setState({
                                        selectedIndex:key
                                    })
                                  }}
                                >
                                  {val.title}
                                </a>
                              ))}
                            </Carousel>
                        </div>

                        <Tabs
                          tabs={this.state.time_tabs}
                          swipeable={false}
                          onChange={this.timeTabsChange}
                        >
                            <div>
                                <p className="time_txt_line">
                                    <span>{this.state.timeInfo}</span>
                                    <i className="line"></i>
                                </p>
                                <div className="seckill_list">
                                    {this.state.time_goods.map((val,key)=>{
                                        return ( <MiaoShaItemComponent data={val}/>)
                                    })}
                                </div>
                            </div>
                        </Tabs>
                    </div>


                    <div className="apt_list_box borderTop5">
                        <div className="home_title"><span className="txt">{ this.state.pintuanTitle }</span></div>
                        <div className="apt_list">
                            <Carousel className="space-carousel"
                              frameOverflow="visible"
                              selectedIndex={0}
                              cellSpacing={15}
                              slideWidth={0.8}
                              dots={false}
                              infinite
                            >
                                {this.state.pintuanArr.map((val,key)=>( <PintuanItemComponent data={val}/>)) }
                            </Carousel>
                        </div>
                    </div>


                    <div className="top_list_box borderTop5">
                        <div className="home_title"><span className="txt">{ this.state.topTitle }</span></div>
                        <div className="top_list">
                            {this.state.topGoodsArr.map((val,key)=>{
                                val.productsubname = val.title;
                                return ( <GoodsListItemComponent data={val}/>)
                            })}
                        </div>
                    </div>


                    <div className="banner_list_box borderTop5">
                        <div className="home_title" onClick={()=>{
                            this.clickIconFn(this.state.bannerHref);
                        }}><span className="txt">{ this.state.bannerTitle }</span></div>
                        <div className="banner_list">
                            {this.state.bannerData.map((val,key)=>{
                                
                                return ( <img src={val.imageUrl} alt="" onClick={()=>{
                                    this.clickIconFn(val.linkUrl);
                                }}/> )
                            })}
                        </div>
                    </div>
                    
                    {this.state.choiceData?
                    <div className="choice_list_box borderTop5">
                        <div className="home_title" onClick={()=>{
                            this.clickIconFn(this.state.choiceData.title.moreUrl);
                        }}><span className="txt">{ this.state.choiceData.title.title }</span></div>
                        <div className="choice_list">
                            {this.state.choiceData.data.map((val,key)=>{
                                return ( <img src={val.imageUrl} alt="" style={{ width: '100%', verticalAlign: 'top' }} onClick={()=>{
                                    this.clickIconFn(val.linkUrl);
                                }}/> )
                            })}
                        </div>
                    </div>
                    :''}


                    {this.state.newDateGoods?<PageItemComponent data={this.state.newDateGoods} clickBannar={this.clickBannar} clickIconFn={this.clickIconFn}/>:''}


                    







                </div>
            )
        }  
    }


export class PageItemComponent extends React.Component {
    render() {
        const o = this.props.data;
        // console.log(o.data)
        return (
            <div key={ o.title.title } className={"page_list_box  "+ (!o.pageIndex ? "borderTop5" : (o.pageIndex && o.pageIndex==1)?"borderTop5" :"")  }>

                { !o.pageIndex? <div className="home_title" onClick={()=>{
                    this.props.clickIconFn( o.title.moreUrl );
                }}><span className="txt">{ o.title.title }</span></div> : (o.pageIndex && o.pageIndex==1)?<div className="home_title" onClick={()=>{
                    this.props.clickIconFn( o.title.moreUrl );
                }}><span className="txt">{ o.title.title }</span></div>:'' }

                
                
                {o.bannerData && (o.bannerData.length>1?
                    <Carousel
                      autoplay={false}
                      infinite
                      selectedIndex={0}
                    >
                      {o.bannerData && o.bannerData.map( (val,key )=> {
                        return(
                          <img
                            src={val.imageUrl}
                            alt={val.title}
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onClick={() => {
                                this.props.clickBannar(val.linkUrl)
                            }}
                          />
                        )
                      })}
                    </Carousel>
                    :
                    (o.bannerData.length?<img
                        src={o.bannerData[0].imageUrl}
                        alt={o.bannerData[0].title}
                        style={{ width: '100%', verticalAlign: 'top' }}
                        onClick={() => {
                            this.props.clickBannar(o.bannerData[0].linkUrl)
                        }}
                      />:'')
                )}

                <div className="page_list">
                    {o.data.map((val,key)=>{
                        console.log(val)
                        return ( <TwoLineGoodsListItemComponent data={val} twoLineRow={true} />)
                    })}

                </div>

                {!o.pageIndex? <div className="pageBottom" >
                    <span onClick={()=>{
                        this.props.clickIconFn( o.title.moreUrl );
                    }}>更多{ o.title.title }</span>
                </div> : ''} 
                
                {/*<div className="banner_list">
                    {this.state.bannerData.map((val,key)=>{
                        
                        return ( <img src={val.imageUrl} alt="" onClick={()=>{
                            this.clickIconFn(val.linkUrl);
                        }}/> )
                    })}
                </div>*/}
            </div>
        )
    }
}



class IndexComponent extends React.Component {
    state = {
        selectedIndex:0,

        searchWord: '',
        placeholder: '搜索类别、品牌、商品',
        isTwoLoaded:false,
        
        key:'22',
        isShowScrollTop: false,
        ajaxParams: {
            url: api_host + 'zhbService/mobile/getRecommendPage',
            data: {
                flag: '4',
                type: 1,
                access_token: Cookies.get("access_token") || '1352467890bqfy',
                version:'3.0.4',
                categoryId:''
            },
            rsDatakey: 'data'
        },
        pageType:0,
    }
    componentWillMount() {
        document.querySelector('html').id="indexHtml"
        document.title = "爱品选";
    }
    componentDidMount() {
        this.setState({
            listHeight: document.body.clientHeight
        })
    }
    render() {
        const tabs = [
          { title: '推荐' },
          { title: '每日上新' },
          { title: '服务' },
          { title: '母婴' },
          { title: '日化' },
          { title: '每日上新' },
          { title: '服务' },
          { title: '母婴' },
          { title: '日化' },
        ];

        return (
            <div className="search-container index_pages">
                <SearchBarComponent
                    searchWord={this.state.searchWord}
                    placeholder={this.state.placeholder}
                    
                />

                <div className="index_tabs">
                    <StickyContainer>
                    <Tabs
                     tabs={tabs}

                     swipeable={false}
                     useOnPan={true}
                     renderTabBar={renderTabBar}
                    >
                        <div>
                            <ListContainer
                                useBodyScroll={true}
                                loadType={'index'}
                                twoLineRow={false}
                                ajaxParams = {
                                    this.state.ajaxParams
                                }
                                rowTpl={(rowData,pageIndex,dataType,categoryId) => {
                                    console.log(this.state.ajaxParams.data.categoryId)
                                    console.log(rowData,pageIndex,dataType,categoryId)

                                    


                                    if( pageIndex == 1 && rowData[0].type != 3 ){
                                        return (
                                            <OnePageComponent indexData={rowData}/>
                                        )
                                    }else{
                                            let pageData = rowData[0];

                                            let categoryIdArr = this.state.indexData[_.findLastIndex( this.state.indexData , {type: '11'})]['data'];

                                            
                                            if( rowData[0].type != 3 ){
                                                {pageData.data.map((val,key)=>{
                                                    val.productsubname = val.title;
                                                })}
                                            }
                                                if (pageData.data.length > 0) {
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
                                                    rowData[0].data = formatData(pageData.data)
                                                }
                                            



                                            

                                            



                                            return (
                                                <PageItemComponent data={rowData[0]}/>

                                                 
                                            )
                                        
                                    }
                                    
                                }}
                                ajaxData={(rs, pageIndex) => {
                                    if( this.state.ajaxParams.data.type == 1 && pageIndex == 1 ) {
                                        this.setState({
                                           indexData: rs.data
                                        })
                                    }

                                    let categoryIdArr = this.state.indexData[_.findLastIndex( this.state.indexData , {type: '11'})]['data'];
                                    
                                    console.log(pageIndex , categoryIdArr.length)

                                    if(!this.state.isTwoLoaded){
                                        this.setState({
                                           ajaxParams:{
                                                ...this.state.ajaxParams,
                                                data:{
                                                    ...this.state.ajaxParams.data,
                                                    type:(pageIndex-1) < categoryIdArr.length ?'2':'3',
                                                    categoryId: (pageIndex-1) < categoryIdArr.length ?categoryIdArr[pageIndex-1]:''
                                                }
                                            }
                                        },()=>{
                                            if( ! ((pageIndex-1) < categoryIdArr.length)  ){
                                                this.setState({
                                                    isTwoLoaded:true
                                                })
                                            }
                                        })
                                    }
                                    


                                    
                                    
                                }}
                                listViewWrapHeight={this.state.listHeight}
                                notNeedRefresh={true}
                            />
 
                            {this.state.isShowScrollTop &&
                                <ScrollToTopComponent
                                    scrollContainerClassName='am-list-view-scrollview'
                                />
                            }
                        </div>


                        

                        <div>
                            <OnePageComponent />
                        </div>

                        <div>
                            3
                        </div>
                        <div>
                            4
                        </div>
                        <div>
                            5
                        </div>
                    </Tabs>
                    </StickyContainer>
                </div>
                
                
            </div>
        )
    }
}
export default IndexComponent;



