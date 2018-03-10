const React = require('react');

import { Flex } from 'antd-mobile';
import Cookies from 'js-cookie';
import commonFn from '../../libs/commonfn.js';
import appFunc from '../../libs/appfuncs';
import ListContainer from '../../components/listContainer';
import { BuyerOrderItem } from './buyerOrderItem.js';
import './css/buyerOrderDetail.less';

class BuyerOrderDetail extends React.Component {
    state={
        userId: Cookies.get('uid'),
        token: Cookies.get('access_token'),
        list: [],
        data: {}
    }

    componentWillMount() {
        appFunc.navigationBarUpdated('买家订单详情', '13');
        document.title = "买家订单详情";
        fetch(api_host + 'zhbService/mobile/getBuyerOrderDetail', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get("access_token") || "1352467890bqfy",
                orderId: commonFn.getUrlAttribute('orderId'),
                productId: commonFn.getUrlAttribute('productId'),
                productDetailId: commonFn.getUrlAttribute('productDetailId'),
                pageSize: 50,
                pageIndex: 1,
                version: '3.0.3',
                platform: 'mSite'
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    this.setState({
                        data: rs.data.data,
                        list: rs.data.list
                    })
                } else {
                    Toast.info(rs.errorMessage)
                }
            })
            .catch((err) => {
                document.write(err)
                commonFn.getNewToken({
                    uid: Cookies.get('uid'),
                }, (rs) => {
                    // this.initFetch();
                });
            })
    }

    componentDidMount() {}

    render() {
        return (
            <div className='buyerOrderDetail'>
            {!!this.state.list.length ? (<Flex direction='column' className="flexwrap">
              <BuyerOrderItem data={this.state.data} key={this.state.data.productDetailId}/>
              <Flex.Item>
                {
            this.state.list.map((i, index) => {
                return (<div key={`orderListItem${index}`} className="orderListItem">{i.mobileNumber}<span className="tip">{i.successTip}</span><span className="time">{i.orderTime}</span> </div>)
            })
            }
              </Flex.Item>
              </Flex>) : (<Flex direction='column' className="flexwrap">
              <BuyerOrderItem data={this.state.data} key={this.state.data.productDetailId}/>
              <Flex.Item>
              111
              </Flex.Item>
              </Flex>)}
            </div>
        )
    }
}


export default BuyerOrderDetail



