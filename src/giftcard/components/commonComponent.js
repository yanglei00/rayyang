import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PullToRefresh, Button } from 'antd-mobile';
import Cookies from 'js-cookie';

import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import './css/common.less';

import moment from 'moment';


import nodataBg from './img/no_data.png';
import noCardDataBg from './img/currently_unavailable@2x.png';

// 无数据
export class NotDataComponent extends React.Component {
    render(){
        return (
            <div className="not-data-container">
                <img src={noCardDataBg}/>
                <p>{this.props.txt?this.props.txt:'您和您的盟友还没有交易额'}</p>
            </div>
        )
    }
}

