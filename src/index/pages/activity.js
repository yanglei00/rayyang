const React = require('react');

import { Button, InputItem, Toast } from 'antd-mobile';
import Cookies from 'js-cookie';
import { animateScroll as scroll } from 'react-scroll';

import appFunc from '../../libs/appfuncs';
import commonFn from '../../libs/commonfn';
import { GoodsListComponent, ScrollToTopComponent } from '../../components/commonComponent';

import './css/activity.less';

class ActivityList extends React.Component {
    state = {
        data: null,
    }

    componentWillMount() {
        document.title = "爱品选";

        fetch(api_host + 'zhbService/mobile/getHotActivityPage', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
                pageIndex: 1,
                pageSize: 20,
            })
        }).then((rs) => {
            return rs.json()
        }).then((rs) => {
            this.setState({
                data: rs.data
            })
        })
    }
    componentDidMount() {
        console.log(this.props)
    }
    render() {
        return (
            <div className="activity-container">
                <GoodsListComponent
                    listHeader={this.state.data && this.state.data.hotActivityList &&
                        <div className="activity-list-container">
                            <ul className="activity-list-content">
                                {this.state.data.hotActivityList && this.state.data.hotActivityList.map((o,i)=>{
                                    return(
                                        <li className="activity-list-item-content" key={i}>
                                            <img className="activity-list-item-pic" src={o.imageUrl} onClick={()=>{
                                                appFunc.gotoAppUrlFormat(o.linkUrl)
                                            }}/>
                                            <p className="activity-list-item-des"><span className="activity-list-item-time">活动仅剩{o.endTime}天</span><span className="activity-list-item-sum">已售：{o.saleNum}件</span></p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    }
                    flag={3}
                    listTitle='为您推荐'
                />
            </div>
        )
    }
}


export default ActivityList;



