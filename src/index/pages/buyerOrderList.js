const React = require('react');

import Cookies from 'js-cookie';
import commonFn from '../../libs/commonfn.js';
import appFunc from '../../libs/appfuncs';
import ListContainer from '../../components/listContainer';
import { BuyerOrderItem } from './buyerOrderItem.js';
import './css/buyerOrderList.less';

class BuyerOrderList extends React.Component {
    state={
        userId: Cookies.get('uid'),
        token: Cookies.get('access_token'),
        list: []
    }

    componentWillMount() {
        appFunc.navigationBarUpdated('买家订单', '13');
        document.title = "买家订单";
        fetch(api_host + 'zhbService/mobile/getBuyerOrderList', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get("access_token") || "1352467890bqfy"
            }),
        }).then((rs) => {
            return rs.json();
        })
            .then((rs) => {
                if (rs.errorCode == 0) {
                    this.setState({
                        list: rs.data
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

    componentDidMount() {}

    render() {
        return (
            <div className='buyerOrderList'>
              {this.state.list.map((i, index) => {
                return (<BuyerOrderItem data={i} key={i.productDetailId}/>)
            })}
            </div>
        )
    }
}


export default BuyerOrderList



