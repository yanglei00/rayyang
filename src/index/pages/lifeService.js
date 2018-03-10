const React = require('react');
import { Flex } from 'antd-mobile';
import Cookies from 'js-cookie';
import commonFn from '../../libs/commonfn.js';
import appFunc from '../../libs/appfuncs';
import './css/lifeService.less';
class LifeService extends React.Component {
    state={
        data: []
    }
    componentWillMount() {
        fetch(api_host + 'zhbService/mobile/getLifeServicePage', {
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
                        data: rs.data
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
    render() {
        console.log(this.state.data.length)
        return (
            <div className="lifeService">
            {
            !!this.state.data.length && this.state.data.map((i, index) => {
                return (<div key={`lifeServiceMoudle${index}`} className="lifeServiceMoudle">
                <div className="title">{i.title}</div>
                <div className="content">{
                    i.data.map((_i, _index) => {
                        return (<div key={`cube_${index}_${_index}`} className="cube"><img src={_i.imageUrl} alt=""/><p>{_i.title}</p></div>)
                    })
                    }</div>
                    </div>)
            })
            }{!!this.state.data.length && (<div className="more">更多服务  敬请期待</div>)}
            </div>
        )
    }
}

export default LifeService