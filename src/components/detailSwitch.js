import React from 'react';
import Cookies from 'js-cookie';


import { Drawer, Checkbox } from 'antd-mobile';
import commonFn from '../libs/commonfn';
import './css/detailSwitch.less';
class BtnItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }
    render() {
        return (<span>{this.state.data.name}</span>)
    }
}
class DeailSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: "b36fb20924414dd685f262ad91e3b77c",
            detailId: "67a9edcf3d6b487fa8e1192024b58e54",
            access_token: "1e3962ce163b37f52cd093dfa4cb6aa365cf2cad",
            userId: "7c370d049a064112ba4cf46e78448997"
        }
    }
    componentDidMount=() => {
        console.log('done')
        fetch(api_host + 'zhbService/mobile/goodInfo', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                userId: this.state.userId,
                productId: this.state.productId,
                access_token: this.state.access_token,
                platform: 'WeChat',
                version: '2.0.5'
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
    }
    state={
        open: true
    }
    render() {
        console.log('done')

        const sidebar = this.state.data ? (<div>
            <div className="topArea">
                <img src={this.state.data.productInfo.productImages[0]} alt=""/>{this.state.data.productInfo.price, this.state.data.productInfo.oldPrice}
            </div>
            {
        (<div className="btnArea">
                    {this.state.data.productAttrsInfo.map((i, index) => {
            return (<div key={Math.random()}><div className="btnTitle">{i.title}</div><div className="btnGroup">{i.value.map((ii, iindex) => {
                    return (<BtnItem data={ii} key={Math.random()}/>)
                })}</div></div>)
        })}
                </div>)
        }
           
            </div>) : (<div></div>)
        return (
            <div className="detailSwitch">
            <Drawer
            className="my-drawer"
            style={{
                minHeight: document.documentElement.clientHeight
            }}
            position="bottom"
            contentStyle={{
                color: '#A6A6A6',
                textAlign: 'center',
                backgroundColor: 'transparent',
                border: 'none'
            }}
            contentStyle={{
                color: '#A6A6A6',
                textAlign: 'center',
                backgroundColor: 'transparent',
                border: 'none'
            }}
            sidebarStyle={{
                border: '1px solid #ddd',
                backgroundColor: '#ffffff',
                maxHeight: 420,
                minHeight: 420,
                border: 'none'
            }}
            sidebar={sidebar}
            open={true}
            >111
      </Drawer></div>
        );
    }
}




export default DeailSwitch
