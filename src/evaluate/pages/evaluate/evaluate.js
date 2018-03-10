const React = require('react');
const ReactDOM = require('react-dom');
import { Icon, Flex, Toast, Modal, Button, ImagePicker, Checkbox } from 'antd-mobile';
import Cookies from 'js-cookie';
import Rating from 'react-rating';
import commonFn from '../../libs/commonfn.js';
import appFunc from '../../libs/appfuncs.js';
// import { appFunc } from './../libs/appfuncs.js'
const alert = Modal.alert;

import createHistory from 'history/createHashHistory'

import '../css/evaluate/evaluate.less';
const history = createHistory();


// 上传图片选择组件
const imageUploadData = [];
class ImagePickerComponent extends React.Component {

    state = {
        files: imageUploadData,
        urlArr: []
    };
    onChange = (files, type, index) => {
        console.log(files, type, index);
        let uploadFetch=() => {
            // 上传图片接口
            let formData = new FormData();
            var $Blob = commonFn.dataURLtoBlob(files[files.length-1].url);
            formData.append("fieldName", $Blob, '.png');
            formData.append("access_token", Cookies.get('access_token')); //
            formData.append("userId", Cookies.get('uid'));
    
            // Toast.loading('上传图片中…', 0, () => { });
            fetch(api_host + 'zhbService/mobile/uploadEvaluateImg', {
                method: 'POST',
                body: formData,  
            })
            .then((rs)=>{
                if(rs.status == 401){
                    commonFn.getNewToken({
                        uid: Cookies.get('uid'),
                    },  (rs) => {
                        uploadFetch();
                    });
                }
                return rs.json();
            })
            .then((rs)=>{
                if(rs.errorCode == 0){
                    this.setState({
                        files,
                        urlArr: [
                            ...this.state.urlArr,
                            rs.data[0]
                        ]
                    }, ()=>{
                        this.props.onChange(this.state.urlArr)
                    });
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        if(type == 'add'){
            if(files.length > 1){
                let isAlone = files.slice(0,files.length-1).every((o, i) =>{
                    console.log(o.file.name,files[files.length-1].file.name)
                        return o.file.name != files[files.length-1].file.name;
                })
                if(isAlone){
                    uploadFetch();
                }     
            }else{
                uploadFetch();
            }
        }else if(type == 'remove'){
            this.setState({
                files,
                urlArr: [
                    ...this.state.urlArr.slice(0, index),
                    ...this.state.urlArr.slice(index+1)
                ]
            }, ()=>{
                this.props.onChange(this.state.urlArr)
            });
        }
    };
    onTabChange = (key) => {
        // console.log(key);
    };
    render() {
        const { files } = this.state;
        return (
            <div>
                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={files.length < 3}
                //   onAddImageClick={this.onAddImageClick}
                />
            </div>
        );
    }
};
class EditItemComponent extends React.Component {
    state={
        list: this.props.list,
    }
    render(){
        return (
            <div className="edit-item-container">
                {this.props.initData.map((o, i)=>{
                    return (
                        <div className="edit-item" key={i}>
                            <div className="edit-item-header">
                                <ul className="edit-item-header-content">
                                    <li className="edit-item-header-pic">
                                        <img src={o.productImg} />
                                    </li>
                                    <li className="edit-item-header-text">商品相符</li>
                                    <li className="edit-item-header-rating">
                                        <div className="edit-item-rating">
                                            <Rating
                                                initialRate={Number(this.state.list[i].goodsConform)}
                                                full={<img src={require('../img/shap.png')} className="full-rating-pic"/>}
                                                empty={<img src={require('../img/shape_empty.png')} className="empty-rating-pic"/>}
                                                onChange={(rate)=>{
                                                    this.setState({
                                                        list: [
                                                            ...this.state.list.slice(0, i),
                                                            Object.assign({}, this.state.list[i], {
                                                                goodsConform: rate
                                                            }),
                                                            ...this.state.list.slice(i+1) 
                                                        ],
                                                        rate: rate
                                                    }, ()=>{
                                                        this.props.onEdit(this.state.list);
                                                    })
                                                }}
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="edit-item-body">
                                <textarea placeholder="在这里分享您的购物体验（最多输入100字）" maxLength="100" onInput={(e)=>{
                                    this.setState({
                                        list: [
                                            ...this.state.list.slice(0, i),
                                            Object.assign({}, this.state.list[i], {
                                                content: e.target.value
                                            }),
                                            ...this.state.list.slice(i+1) 
                                        ],
                                    }, ()=>{
                                        this.props.onEdit(this.state.list);
                                        
                                    })
                                }}>
                                </textarea>
                            </div>
                            <div className="edit-item-footer">
                                <ImagePickerComponent onChange={(urlArr)=>{
                                    this.setState({
                                        list: [
                                            ...this.state.list.slice(0, i),
                                            Object.assign({}, this.state.list[i], {
                                                url: urlArr
                                            }),
                                            ...this.state.list.slice(i+1) 
                                        ],
                                    }, ()=>{
                                        this.props.onEdit(this.state.list);
                                    })
                                }}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
};
class EvaluateSuccessComponent extends React.Component{
    render(){
        return (
            <div className="evaluate-success-mask">
                <div className="evaluate-success-content">
                    <div className="evaluate-success-tip">评价成功</div>
                    <div className="evaluate-success-text">{this.props.text}</div>
                </div>
            </div>
        )
    }
}
class EvaluateComponent extends React.Component{
    state={
        initData: null,
        "overallMerit": "5",
        "customerService": "5",
        "logisticsService": "5",
        list: [],
        anonymity: 0,
        isEvaluateSuccess: false,
        evaluateSuccessText: '',
    }
    componentDidMount(){
        document.title = '评价';
        this.initFetch();
    }
    initFetch(){
        fetch(api_host + 'zhbService/mobile/getEvaluateOrder', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token:Cookies.get('access_token'),
                userId: Cookies.get('uid'),
                orderId: commonFn.getUrlAttribute('orderId'),
                version: '3.0.0',
                platform: 'WeChat',
            }),
        }).then((rs) => {
            // if (rs.status == 401) {
            //     commonFn.getNewToken({
            //         uid: Cookies.get('uid'),
            //     }, (rs) => {
            //         this.initFetch();
            //     });
            // }
            return rs.json();
        })
        .then((rs) => {
            if(rs.errorCode == 0){
                var listArr = [];
                rs.data.map((o, i)=>{
                    listArr.push({
                        "productId": o.productId,
                        "url": [],
                        "goodsConform": "5",
                        "content": ""
                    })
                })
                this.setState({
                    initData: rs.data,
                    list: listArr
                })
            }else{
                Toast.info(rs.errorMessage)
            }
        })
        .catch((err) => {
            console.log(err)
            commonFn.getNewToken({
                uid: Cookies.get('uid'),
            }, (rs) => {
                this.initFetch();
            });
        })
    }
    saveEvaluate(){
        
        let iscontent = this.state.list.every((o, i)=>{
            return o.content != '';
        })
        let isAllGrate = this.state.list.every((o, i) =>{
            return o.goodsConform != 0;
        }) && this.state.overallMerit && this.state.customerService && this.state.logisticsService;
        console.log(iscontent, isAllGrate)
        if(!iscontent){
            Toast.info('您还有没填写评价内容的项目~')
            return ;
        }else if(!isAllGrate){
            Toast.info('您还有没有评分的项目~');
            return ;
        }
        fetch(api_host + 'zhbService/mobile/saveProductEvaluateList', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: commonFn.urlEncode({
                access_token:Cookies.get('access_token'),
                evaluate: JSON.stringify({
                    "userId": Cookies.get('uid'),
                    "orderId": commonFn.getUrlAttribute('orderId'),
                    "overallMerit": this.state.overallMerit,
                    "customerService": this.state.customerService,
                    "logisticsService": this.state.logisticsService,
                    "list": this.state.list,
                    "anonymity": this.state.anonymity,       //是否匿名评价1是，0否
                }),
                version: '3.0.0',
                platform: 'WeChat',
            }),
        }).then((rs) => {
            if (rs.status == 401) {
                commonFn.getNewToken({
                    uid: Cookies.get('uid'),
                }, (rs) => {
                    this.saveEvaluate();
                });
            }
            return rs.json();
        })
        .then((rs) => {
            console.log(rs)
            if(rs.errorCode == 0){
                if(rs.data.sensitiveCode == 1){ //敏感词
                    Toast.info('您的评价已提交待审，请稍后查看~')
                }else if(rs.data.sensitiveCode == 0){
                    
                    if (rs.data.rewardItem == 1){//积分
                        this.setState({
                            isEvaluateSuccess: true,
                            evaluateSuccessText: rs.data.message
                        }, ()=>{
                            setTimeout(() => {
                                this.setState({
                                    isEvaluateSuccess: false,
                                })
                                window.history.back();
                            }, 3000);
                        });
                    }
                    // Toast.info(rs.data.message, 3, ()=>{
                    //     // history.push('/evaluateSuccess') 
                    // }) 
                }else{
                    Toast.info(rs.data.message)
                }
            }else{
                Toast.info(rs.errorMessage)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
    render (){
        return (
            <div className="evaluate-container">
                <div className="evaluate-content">
                    <div className="evaluate-list">
                        {/* 图片编辑列表 */}
                        {this.state.initData &&
                            <EditItemComponent initData={this.state.initData} list={this.state.list} onEdit={(list)=>{
                                this.setState({
                                    list: list
                                })
                            }}/>
                        }
                    </div>
                    <div className="evaluate-grade-container">
                        <div className="evaluate-grade-title">评分</div>  
                        <ul>
                            <li>
                                <div className="evaluate-grade-text">综合评价</div>
                                <div className="evaluate-grade-rating">
                                    <Rating
                                        initialRate={Number(this.state.overallMerit)}
                                        full={<img src={require('../img/shap.png')} className="full-rating-pic" />}
                                        empty={<img src={require('../img/shape_empty.png')} className="empty-rating-pic" />}
                                        onChange={(rate)=>{
                                            this.setState({
                                                overallMerit: rate
                                            })
                                        }}
                                    />
                                </div>
                            </li>
                            <li>
                                <div className="evaluate-grade-text">客服服务</div>
                                <div className="evaluate-grade-rating">
                                    <Rating
                                        initialRate={Number(this.state.customerService)}
                                        full={<img src={require('../img/shap.png')} className="full-rating-pic" />}
                                        empty={<img src={require('../img/shape_empty.png')} className="empty-rating-pic" />}
                                        onChange={(rate)=>{
                                            this.setState({
                                                customerService: rate
                                            })
                                        }}
                                    />
                                </div>
                            </li>
                            <li>
                                <div className="evaluate-grade-text">物流服务</div>
                                <div className="evaluate-grade-rating">
                                    <Rating
                                        initialRate={Number(this.state.logisticsService)}
                                        full={<img src={require('../img/shap.png')} className="full-rating-pic" />}
                                        empty={<img src={require('../img/shape_empty.png')} className="empty-rating-pic" />}
                                        onChange={(rate)=>{
                                            this.setState({
                                                logisticsService: rate
                                            })
                                        }}
                                    />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="evaluate-footer">
                    <div className="evaluate-footer-left">
                        <Checkbox onChange={(e)=>{
                            
                            this.setState({
                                anonymity: e.target.checked? 1: 0
                            }, ()=>{

                            console.log(this.state.anonymity)
                            })
                        }}>匿名评价</Checkbox>
                    </div>
                    <Button
                        className="evaluate-footer-btn"
                        onClick={()=>{
                            this.saveEvaluate();
                        }}
                    >发布</Button>

                </div>
                {this.state.isEvaluateSuccess &&
                    <EvaluateSuccessComponent text={this.state.evaluateSuccessText}/>
                }
            </div>
        )
    }
}
export default EvaluateComponent;