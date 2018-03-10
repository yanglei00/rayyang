const React = require('react');

import { Button, InputItem, Toast } from 'antd-mobile';
import Cookies from 'js-cookie';


// import appFunc from './../libs/appfuncs';
import commonFn from '../../libs/commonfn';
import { GoodsListComponent, ScrollToTopComponent, } from '../../components/commonComponent';

class GoodsList extends React.Component {
    state = {

    }

    componentWillMount() {
        let title = '商品列表';
        switch(commonFn.getUrlAttribute('flag')){
            case 6:
                title = '每日上新';
                break; 
            default: 
                title = '商品列表';
        }
        if(commonFn.getUrlAttribute('beFrom') == 'index'){
            title = '爱品选';
        }
        document.title = title;
    }
    componentDidMount() {
        console.log(this.props)
    }
    render() {
        return (
            <div className="gooods-list-container">
                <GoodsListComponent
                    flag={commonFn.getUrlAttribute('flag')}
                /> 
            </div>
        )
    }
}


export default GoodsList;



