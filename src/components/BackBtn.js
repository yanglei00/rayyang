import React from 'react'
import { Icon } from 'antd-mobile';
import {Link} from 'react-router-dom'

import appFuncs from './../libs/appfuncs';



import createHistory from 'history/createHashHistory'
const history = createHistory()

class BcakBtn extends React.Component {
	
	toAppBack = () => {
		appFuncs.appBack();
	}
	
	renderBackBtn = () => {
		
		if( appFuncs.isApp ){
			return ( <span onClick={ this.toAppBack } style={this.props.style}><Icon key="98" type="left" /></span> )
		}else{
			return ( <Link to={this.props.to} style={{marginLeft: '-0.6rem',display:'block',marginTop:'0.1rem'}}><Icon key="98" type="left" /></Link> )
		}
		
	}
	render(){
		
		if( appFuncs.isApp ){
			return ( <span onClick={ this.toAppBack } style={this.props.style}><Icon key="98" type="left" /></span> )
		}else{
			if( this.props.onPropsClick ){
				return ( <span onClick={ this.props.onPropsClick } style={this.props.style}><Icon key="98" type="left" /></span> )
			}else{
				return ( <Link to={this.props.to} style={{marginLeft: '-0.6rem',display:'block',marginTop:'0.1rem'}}><Icon key="98" type="left" /></Link> )
			}

		}
	}
}





export default BcakBtn