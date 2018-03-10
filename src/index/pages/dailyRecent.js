const React = require('react');

import { Button, InputItem, Toast } from 'antd-mobile';
import Cookies from 'js-cookie';
import appFunc from '../../libs/appfuncs';
import ListContainer from '../../components/listContainer';
import '../../giftcard/pages/css/list.less';
class GoodsItem extends React.Component {
    render() {
        let lineDatas = this.props.data;
        return (
            <div className="linePro">
                {lineDatas.map((line_data, lineKey) => (
                <div className="lineItem" onClick={() => {
                    appFunc.toAppProductDetail({
                        productDetailId: line_data.productDetailId,
                        productId: line_data.productId
                    })
                }
                } key={line_data.productDetailId + '1'}>
                        <div className="img_left">
                            {(line_data.colornum > 1 ? <em>{line_data.colornum + '色可选'}</em> : '')}
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
                            <div className="price"><span>{'￥' + line_data.price}</span><span className="oldprice">{line_data.oldprice && '￥' + line_data.oldprice}</span></div>
                            {Number(line_data.totalevalate) ? <div className="pingjia_line"><span className="pingjia_num">{line_data.totalevalate}条评价</span><span className="pingjia_rang">{line_data.goodrate}%好评</span></div> : ''}
                        </div>
                        
                    </div>
            ))}
            </div>
        )
    }
}
class DailyRecent extends React.Component {
    state={
        userId: Cookies.get('uid'),
        token: Cookies.get('access_token'),
        data: [],
        ajaxParams: {
            url: api_host + 'zhbService/mobile/queryProductList',
            // url: '../../mock/list.json',
            data: {
                version: '3.0.3',
                access_token: Cookies.get("access_token") || "1352467890bqfy",
                userId: Cookies.get("uid"),
                pageSize: 20,
                flag: '6',
                platform: 'mSite'
            },
            rsDataTwoKey: 'list',
            rsDatakey: 'data'
        },
        noData: false,
    }

    componentWillMount() {}

    componentDidMount() {
        this.setState({
            listHeight: document.body.clientHeight
        })
    }

    render() {
        return (
            <div className='brandHalfOff'>
                <ListContainer
            twoLineRow={true}
            ajaxParams = {
            this.state.ajaxParams
            }
            rowTpl={(rowData) => {
                return (
                    <GoodsItem data={rowData}/>
                )
            }}
            ajaxData={(rs, pageIndex) => {
                if (!rs.data.list.length && pageIndex == 1) {
                    this.setState({
                        noData: true
                    })
                }
            }}
            listViewWrapHeight={ this.state.listHeight }
            notNeedRefresh={true}
            />
            </div>
        )
    }
}


export default DailyRecent



