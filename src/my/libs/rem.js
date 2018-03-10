export default function (){
	// 获取窗口大小的兼容写法
	var width = window.innerWidth;
	var height = window.innerHeight;
	if(typeof width != 'number'){
		if(document.compatMode == 'CSS1Compat'){
			width = document.documentElement.clientWidth;
			height = document.docuementElement.clientHeight;
		}
	}else{ 
		// width = document.body.clientWidth;
		// height = document.body.clientHeight;
	}
	document.documentElement.style.fontSize=width/7.5+"px";
	
//	onresize=function(){
//		document.documentElement.style.fontSize=width/7.5+"px";
//	}
}