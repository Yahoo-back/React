import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import store from './store';
import './assets/css/reset.css';
import './assets/css/common.less';
import './assets/font/iconfont.css';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
ReactDOM.render(
    <Provider store={store}>
        <ConfigProvider locale={zh_CN}>
            <App />
        </ConfigProvider>
    </Provider>,
    document.getElementById('root')
);


