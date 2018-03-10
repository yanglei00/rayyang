const React = require('react');

import { Button, InputItem, Toast } from 'antd-mobile';
import Cookies from 'js-cookie';
import appFunc from '../../libs/appfuncs';
import ListContainer from '../../components/listContainer';
import './css/choice.less';
class ChoiceItem extends React.Component {
    render() {
        let line_data = this.props.data;
        return (
            <div onClick={() => {
                appFunc.gotoAppUrlFormat(line_data.linkUrl)
            }}>
            <img src={line_data.imageUrl} alt=""/></div>
        )
    }
}
class Choice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preventSetTitle: this.props.preventSetTitle && false,
            userId: Cookies.get('uid'),
            token: Cookies.get('access_token'),
            data: [],
            ajaxParams: {
                url: api_host + 'zhbService/mobile/getSelectedList',
                // url: '../../mock/list.json',
                data: {
                    version: '3.0.3',
                    access_token: Cookies.get("access_token") || "1352467890bqfy",
                    userId: Cookies.get("uid") || '',
                    pageSize: 20,
                    platform: 'mSite'
                },
                rsDataTwoKey: 'list',
                rsDatakey: 'data'
            },
            noData: false,
        };
    }

    componentWillMount() {
        if (this.state.preventSetTitle) {
            appFunc.navigationBarUpdated('精选专题', '13');
            document.title = "精选专题";
        }
    }

    componentDidMount() {
        this.setState({
            listHeight: document.body.clientHeight
        })
    }

    render() {
        return (
            <div className='choice'>
                <ListContainer
            ajaxParams = {
            this.state.ajaxParams
            }
            rowTpl={(rowData) => {
                return (
                    <ChoiceItem data={rowData}/>
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


export default Choice



