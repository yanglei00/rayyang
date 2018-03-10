const React = require('react');
const ReactDOM = require('react-dom');
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import Cookies from 'js-cookie';
import { StickyContainer, Sticky } from 'react-sticky';
import { Icon, Flex, Toast, Modal, Switch, List, Tabs, Checkbox, WhiteSpace, Steps, Button } from 'antd-mobile';
// import { appFunc } from './../libs/appfuncs.js'
const alert = Modal.alert;
const Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;
const Step = Steps.Step;


import { ProductListItemComponent} from '../components/commonComponent';
import './css/logistics.less';


function renderTabBar(props) {
    return (<Sticky>
        {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
let tabs = [];
// let tabs = [];
class LogisticsComponent extends React.Component {
    constructor(props){
        super(props)
        this.state={
            data:null,
            showNum: 2,
            // isShowMore: null,
        }
    }
    componentDidMount(){
        document.title = '物流信息'
        this.initFetch();
    }
    initFetch = () => {
        fetch(api_host + 'zhbService/mobile/getDeliverys', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                orderNo: commonFn.getUrlAttribute('orderId'),
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    this.setState({
                        data: rs.data
                    })
                    if (rs.data) {
                        rs.data.packageList.map((o, i) => {
                            tabs.push({
                                title: '包裹' + (i + 1),
                            })
                            this.setState({
                                ['isShowMore' + i]: false,
                            })
                        })
                    }
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
    render() {
        return (
            <div className="logistics-container">
            {this.state.data &&
                <StickyContainer>
                    <Tabs tabs={tabs}
                        renderTabBar={(this.state.data.packageList && this.state.data.packageList.length > 1? renderTabBar: false)}
                    >
                        {this.state.data.packageList && this.state.data.packageList.map((o,i)=>{
                            let I = i;
                            console.log(o)
                            return(
                                <div className="tabpanel" key={i}>
                                    {this.state.data.packageList && this.state.data.packageList.length > 1 &&
                                        <div className="product-list-container">
                                            {o.productList && o.productList.map((o,i)=>{
                                                if (!this.state['isShowMore'+I] && (i >= this.state.showNum)) {
                                                    return <div key={i} />;
                                                }
                                                return (
                                                    <ProductListItemComponent
                                                        key={i}
                                                        data={{
                                                            pic1url: o.picUrl,
                                                            name: o.mergeName,
                                                            subName: o.normInfo,
                                                            price: o.cash,
                                                            oldPrice: '',
                                                            num: o.buyNum,
                                                        }}
                                                        notCanGoGoodsDetail={true}
                                                    />
                                                )
                                            })}
                                            {o.productList && o.productList.length > 0 && !this.state['isShowMore'+i] &&
                                                <div className="show-more-btn">
                                                    <Button onClick={()=>{
                                                        this.setState({
                                                            ['isShowMore' + i]: true
                                                        })
                                                    }}>展开更多 v</Button>
                                                </div>
                                            }
                                        </div>
                                    }
                                    <div className="logistics-info-wrap">
                                        <div className="logistics-company">承运物流： {o.deliveryCompany}</div>
                                        <div className="logistics-num">物流单号： {o.deliveryNo}</div>
                                    </div>
                                    <Steps size="small" current={1}>
                                        {o.deliveryInfo.data && o.deliveryInfo.data.map((o,i)=>{
                                            return(
                                                <Step 
                                                    key={i}
                                                    title={o.context} 
                                                    description={o.time} 
                                                />
                                            )
                                        })}
                                    </Steps>
                                    {!o.deliveryInfo.data &&
                                        <div className="no-logistics-container">
                                            <div className="no-logistics-content">
                                                <img className=""/>
                                                <p>正在获取物流跟踪记录，请稍后查看</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </Tabs>
                </StickyContainer>
            }
            </div>
        )
    }
}


export default LogisticsComponent;
