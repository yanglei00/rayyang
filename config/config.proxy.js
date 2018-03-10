/**
 *  跨域接口代理配置
 */

module.exports = {
    
    '/zhbService/*': {
        changeOrigin: true,
        target: 'https://t2api.zhbservice.com',
        secure: false,
    },
    '/h5service/*':{
    	changeOrigin: true,
        target: 'https://t2zhbh5.zhbservice.com',
        secure: false,
    }
}