const React = require('react');

import { Button, Tabs, Tag } from 'antd-mobile';
import Cookies from 'js-cookie';
import '../../libs/swiper-3.4.2.min.js';
import '../../components/css/swiper-3.4.2.min.css';
import Iframe from 'react-iframe';

import appFunc from '../../libs/appfuncs';
import commonFn from '../../libs/commonfn';
import { GoodsListComponent, SearchBarComponent } from '../../components/commonComponent';

import './css/search.less';

const tabs = [];
class SearchComponent extends React.Component {
    state = {
        data: null,
        searchWord: '',
        isShowSearchList: false,
    }

    componentWillMount() {
        document.title = "热门搜索";
        this.initFetch();
    }
    componentDidMount() {

    }
    initFetch = () => {
        fetch(api_host + 'zhbService/mobile/hotWordsSearch', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get('access_token'),
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
        return (
            <div className="search-container">
                <SearchBarComponent 
                    searchWord={this.state.searchWord}
                    onLeftClick={()=>{
                        // window.history.back();
                    }}
                    onFocus={()=>{
                        this.setState({
                            isShowSearchList: false,
                        })
                    }}
                    onChange={(value) => {
                        this.setState({
                            searchWord: value,
                            isShowSearchList: false,
                        })
                    }}
                    onCancel={(placeholder)=>{
                        if(!this.state.searchWord){
                            this.setState({
                                searchWord: placeholder
                            })
                        }
                        this.setState({
                            isShowSearchList: true,
                        })
                    }}
                />
                {!this.state.isShowSearchList && this.state.data &&this.state.data.hotwordList &&
                    <div className="hot-search-container">
                        <div className="hot-search-title">热门搜索</div>
                        <div className="hot-search-content">
                        {this.state.data.hotwordList.map((o, i)=>{
                            return(
                                <Tag key={i} onChange={()=>{
                                    this.setState({
                                        searchWord: o.word_name,
                                        isShowSearchList: true,
                                    })
                                }}>{o.word_name}</Tag>
                            )
                        })}
                        </div>
                    </div>
                }
                {this.state.isShowSearchList &&
                    <Iframe url={url_host+"/m/index.html#/categoryGoodsList?condition="+this.state.searchWord}
                        width="100%"
                        height={document.documentElement.clientHeight-44 + 'px'}
                        id="myId"
                        className="myClassname"
                        display="initial"
                        position="relative"
                        allowFullScreen />
                }
            </div>
        )
    }
}
export default SearchComponent;



