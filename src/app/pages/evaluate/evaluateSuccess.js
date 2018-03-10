const React = require('react');
const ReactDOM = require('react-dom');
import { Icon, Flex, Toast, Modal, Button, ImagePicker, Checkbox } from 'antd-mobile';
import Cookies from 'js-cookie';
import createHistory from 'history/createHashHistory'

import commonFn from '../../libs/commonfn.js';
import appFunc from '../../libs/appfuncs.js';
const alert = Modal.alert;

import {MaybeYouLoveComponent} from '../../components/commonComponent';
import '../css/evaluate/evaluate.less';

const history = createHistory();



class EvaluateSuccessComponent extends React.Component {
    state = {
        
    }
    componentDidMount() {
        
    }
   
    render() {
        return (
            <div className="evaluateSuccess-container">
                <MaybeYouLoveComponent
                    logoUrl={require("../../components/img/no_data.png")}
                    text="恭喜您评价成功"
                />
            </div>
        )
    }
}
export default EvaluateSuccessComponent;