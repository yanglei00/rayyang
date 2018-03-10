const React = require('react');

import { Button, InputItem, Toast, Carousel, Flex } from 'antd-mobile';
import Cookies from 'js-cookie';
import commonFn from '../../libs/commonfn.js';
import appFunc from '../../libs/appfuncs';
import ListContainer from '../../components/listContainer';
import ImgCarousel from '../../components/carousel';
import { SecklillOrderItem } from './buyerOrderItem.js';
import './css/seckill.less';
class Seckill extends React.Component {
    state={
        userId: Cookies.get('uid'),
        token: Cookies.get('access_token'),
    }
    initIndex(arr) {
        let index = 0;
        let i = 0
        for (; i < arr.length; i++) {
            if (arr[i].status === "2") {
                index = i;
                break;
            }
        }
        return i
    }
    componentWillMount() {
        appFunc.navigationBarUpdated('限时秒杀', '13');
        document.title = "限时秒杀";
        fetch(api_host + 'zhbService/mobile/getSkillInfo', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token: Cookies.get("access_token") || "1352467890bqfy",
                platform: 'mSite'
            }),
        }).then((rs) => {
            return rs.json();
        }).then((rs) => {
            this.setState({
                imgList: rs.data.bannerList,
                dataList: rs.data.skillList,
                selectedIndex: rs.data.skillList.findIndex((i) => {
                    return i.status === "2"
                })
            })
            console.log(this.state.selectedIndex)
        }).catch()
    }

    componentDidMount() {}

    render() {
        const arr = [
            {
                "imageUrl": "http://t2image.zhbservice.com/17/01/170110161141_016r8.png",
                "linkUrl": "openby:zhbservice={'params':{'title':'1商品分类''},'action':'go.category'}",
                "title": "1商品分类"
            },
            {
                "imageUrl": "http://t2image.zhbservice.com/17/01/170110161141_016r8.png",
                "linkUrl": "openby:zhbservice={'params':{'title':'1商品分类''},'action':'go.category'}",
                "title": "1商品分类"
            }
        ]
        return (
            <div className='seckill'>
            <Flex
            direction="column"
            >
            {this.state.imgList && (<ImgCarousel data={this.state.imgList}></ImgCarousel>)}
               { this.state.dataList && (<Carousel
            autoplay={false}
            infinite={false}
            slideWidth={0.2}
            dots={false}
            selectedIndex={this.state.selectedIndex}
            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            afterChange={index => this.setState({
                selectedIndex: index
            })}
            >
                                  {this.state.dataList.map((val, key) => (
                <a
                key={key}
                onClick={() => {
                    this.setState({
                        selectedIndex: key
                    })
                }}
                className={this.state.selectedIndex == key ? 'on' : 'normal'}
                ><p>{val.startTime}</p> 
                                     <p>{val.title}</p> 
                                    </a>
            ))}
                </Carousel>)}
                <Flex.Item>
                    {this.state.dataList && this.state.dataList[this.state.selectedIndex].productList.map((i, index) => {
                return (<SecklillOrderItem data={i} status={this.state.dataList && this.state.dataList[this.state.selectedIndex].status}></SecklillOrderItem>)
            })}
                </Flex.Item>
               </Flex>
            </div>
        )
    }
}


export default Seckill



