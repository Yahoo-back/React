import axios from 'axios';
import { formatDate, } from "../config/common";
import { message} from 'antd';
import {HashRouter} from 'react-router-dom'
const router = new HashRouter()



// function ajax(option) {
//     return new Promise(
//         function(resolve, reject) {
//             const instance = axios.create({
//                 baseURL: "https://mq.zjyckj.com.cn/api/",
//                 headers: {
//                     'system':4,
//                     'device-type':6,
//                     'device-code':'25F4BBFD679A33B736730D6F6C6A5E1F',
//                     'trade-time': formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
//                     'Content-Type':'application/json',
//                     'platform-token': sessionStorage.getItem('platformToken'),
//                     'system-token': sessionStorage.getItem('systemToken') ,
//                     'organization':sessionStorage.getItem('organizationId'),
//                 },
//                 timeout: 2000 * 1000  //超时设置 20s
//             });
//             instance(option)
//                 .then(response => resolve(response))
//                 .catch(error => reject(error));
//         }
//     );
// }
//
// function post(url, param,responseType='json') {
//     return ajax({
//         method: 'POST',
//         url: url,
//         data: param,
//         responseType
//     })
// }






const axiosIns = axios.create({
    // baseURL: "https://mq.zjyckj.com.cn/api/",
    baseURL: "http://localhost:8009",
    timeout: 20 * 1000,       // 超时设置 20s
    responseType: "json",
    withCredentials: false,   // 是否允许携带cookie, 跨站点
    headers: {
        // "system": 4,
        // "device-type": 6,
        // "device-code": "25F4BBFD679A33B736730D6F6C6A5E1F",
        // "Content-Type": "application/json"
        "Authorization":sessionStorage.getItem('Authorization')
    }
});

axiosIns.interceptors.request.use(config => {
    const Authorization = sessionStorage.getItem('Authorization')
    if(Authorization){
        config.headers['Authorization'] = Authorization;
    }else{
        config.headers['Authorization'] = null;
    }
    if(window.location.pathname == '/login'){
        config.headers['Authorization'] = null;
    }
    else{
        config.headers['Authorization'] = Authorization;
    }
    const platForm = sessionStorage.getItem('platformToken'), system = sessionStorage.getItem('systemToken');
    if (platForm && system) {
        config.headers['platform-token'] = platForm;
        config.headers['system-token'] = system;
    }
    config.headers['trade-time'] = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    if(sessionStorage.getItem('organizationId') && sessionStorage.getItem('type'))
        config.headers['organization'] = sessionStorage.getItem('organizationId');
        return config;
}, error => {
    message.error(error);
    return Promise.reject(error)
});

axiosIns.interceptors.response.use(res => {
    const status = res.headers.businessstatus, msg = res.headers.message;
    if (res.data && (status < 200 || status > 299) && Number(status)!==666) {
        message.error(decodeURIComponent(msg));
        return Promise.reject(decodeURIComponent(msg))
    } else if (Number(status) === 666) {
        sessionStorage.clear();
        message.error(decodeURIComponent(msg));

        setTimeout(()=>{
            message.error('登录时间已过期请退出重新登录！');
            router.history.push('/login')
        }, 1000);
        return Promise.reject(decodeURIComponent(msg))
    }
    return res;
}, error => {
        message.error('网络走丢了');
    return Promise.reject('error.response.data.error')
});


// function get(url, param) {
//     return new Promise((resolve, reject) => {
//         axiosIns({
//             method: "get",
//             url,
//             params: param
//         }).then(res => resolve(res))
//             .catch(err => {
//                 reject(err);
//             });
//     });
// }


function post(url, param,responseType='json') {
    return new Promise((resolve, reject) => {
        axiosIns({
            method: "post",
            url,
            data: param,
            responseType:responseType
        }).then(res => resolve(res))
            .catch(err => {
                reject(err);
            });
    })
}

function get(url,param,responseType='json') {
    return new Promise((resolve, reject) => {
        axiosIns({
            method: "get",
            url,
            data: param,
            responseType:responseType
        }).then(res => resolve(res))
            .catch(err => {
                reject(err);
            });
    })
}

export {get,post}
