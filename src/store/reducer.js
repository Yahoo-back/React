import * as contants from './actionTypes';
import {combineReducers} from 'redux';


//用户信息以及menuList
const defaultUserState = {
    userData:{},
    menuList:[]
}
function userData(state=defaultUserState,action){
    if(action.type===contants.INIT_MENU){
        const newState = JSON.parse(JSON.stringify(state));
        newState.menuList = action.menuList;
        return newState;
    }else if(action.type===contants.LOGIN_DATA){
        const newState = JSON.parse(JSON.stringify(state));
        newState.userData = action.userData;
        sessionStorage.setItem('userData',JSON.stringify(action.userData))
        return newState;
    }
    return state;
}


//banner模块
const defaultBannerState={
    bannerList:[1,2,3]
}
function banner(state=defaultBannerState,action) {
    return state;
}



export default combineReducers({
    userData,
    banner
})

















































































































