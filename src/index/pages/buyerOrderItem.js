const React = require('react');

import { Flex } from 'antd-mobile';
import appFunc from '../../libs/appfuncs';
import './css/buyerOrderItem.less';
import createHistory from 'history/createHashHistory'
const history = createHistory();

export class BuyerOrderItem extends React.Component {
    render() {
        let line_data = this.props.data;
        return (
            <div className="buyerOrderItem" onClick={() => {
                appFunc.toAppProductDetail({
                    productDetailId: line_data.productDetailId,
                    productId: line_data.productId
                })
            }}>
           
            <Flex className="goodInfo">
                <img src={line_data.imageUrl} alt=""/>
                <div className="goodDetail">
                    <div className="line title">{line_data.productName}</div>
                    <div className="line sub">{line_data.productSubName}</div>
                    <div className="line price"><span className="currentprice">{`¥${line_data.price}`}</span><span className="oldprice">{line_data.oldPrice && `¥${line_data.oldPrice}`}</span> <span className="buyNum">{`x${line_data.buyerNumber}`}</span></div>
                    <div className="line sale">{line_data.stock !== "0" ? (<span className="stock" style={{
                backgroundSize: line_data.storePercent * 100 + '% 100%'
            }}>{`仅剩${line_data.stock}件`}</span>) : (<span className="empty">无库存</span>)}
                    <em>{`${line_data.salesVolume}人已购买`}</em></div>
                </div>
            </Flex>
            <div className="orderInfo">{line_data.mobileNumber}<span className="tip">下单成功</span><span className="time">{line_data.orderTime}</span></div>
</div>
        )
    }
}
export class SecklillOrderItem extends React.Component {
    render() {
        let line_data = this.props.data;
        let status = this.props.status;
        console.log(status)
        return (
            <div className="buyerOrderItem SecklillOrderItem" onClick={() => {
                appFunc.toAppProductDetail({
                    productDetailId: line_data.productDetailId,
                    productId: line_data.productId
                })
            }}>
           
            <Flex className="goodInfo">
                <img src={line_data.pic1url} alt=""/>
                {status === '1' ? (<div className="tip_wrap done">已抢完</div>) : (status === '2' ? null : (<div className="tip_wrap will">即将开抢</div>))}
                <div className="goodDetail">
                    <div className="line title">{line_data.name}</div>
                    <div className="line sub">{line_data.title}</div>
                    <div className="line price"><span className="text">秒杀价</span><span className="currentprice">{`¥${line_data.price}`}</span><span className="oldprice">{line_data.oldprice && `¥${line_data.oldprice}`}</span></div>
                    <div className="line sale">{status === '1' ? (<span className="empty sec">{`已抢完${line_data.pnum}件`}</span>) : (<span className="stock sec" style={{
                backgroundSize: line_data.leftPersent * 100 + '% 100%'
            }}>{`仅剩${line_data.pnum}件`}</span>)}
                    {status === '1' ? (<a onClick={(e) => {
                e.stopPropagation();
                history.push('categoryGoodsList?thirdClassifyID=' + line_data.categoryId + '&thirdClassifyName=' + line_data.categoryName);
            }}>去逛逛</a>) : (status === '2' ? (<a>立即抢购</a>) : (<a onClick={(e) => {
                e.stopPropagation();
            }}>即将开抢</a>))}</div>
                </div>
            </Flex>
</div>
        )
    }
}