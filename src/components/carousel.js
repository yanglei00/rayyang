const React = require('react');
import { Carousel } from 'antd-mobile';
import commonFn from '../libs/commonfn.js';
import appFunc from '../libs/appfuncs.js';
import './css/imgCarousel.less';

export default class ImgCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgList: this.props.data
        }
    }
    componentWillMount() {}

    componentDidMount() {}

    render() {
        console.log('组件', this.props.data)
        return this.state.imgList.length > 1 ? (<Carousel
        className="zhbImgCarousel"
        autoplay={true}
        infinite
        selectedIndex={0}
        >
        {
        this.state.imgList.map((i, index) => {
            return (<div
                key={`zhbImgCarousel${index}`}
                onClick={() => {
                    appFunc.gotoAppUrlFormat(i.linkUrl)
                }}>
                <img src={i.imageUrl}/>
                </div>)
        })
        }
        </Carousel>) :
            (<img src={i.imageUrl}/>)
    }
}