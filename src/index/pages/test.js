const React = require('react');

import { Button, InputItem, Toast } from 'antd-mobile';
import Cookies from 'js-cookie';
import appFunc from '../../libs/appfuncs';
import DetailSwitch from '../../components/detailSwitch.js';
import './css/seckill.less';
class Seckill extends React.Component {
    state={
        userId: Cookies.get('uid'),
        token: Cookies.get('access_token'),
    }

    componentWillMount() {
        appFunc.navigationBarUpdated('限时秒杀', '13');
        document.title = "限时秒杀";
    }

    componentDidMount() {
        this.setState({
            listHeight: document.body.clientHeight
        })
    }

    render() {
        return (
            <div className='seckill'>
            <DetailSwitch></DetailSwitch>
            </div>
        )
    }
}


export default Seckill



