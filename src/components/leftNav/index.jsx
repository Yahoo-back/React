import React,{Component} from 'react';
import { Layout,Menu} from 'antd';
import {Link,withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getMenuAction} from "../../store/actionCreators";


const { Sider } = Layout;
const { SubMenu } = Menu;


class LeftNav extends Component{
    getMenuNodes=()=>{
        // let path = this.props.history.location.pathname;
        const menuList =this.props.menuList;
        return menuList.map((item)=>{
            if(item.children.length>0){
                // const cItem= item.children.find(cItem=>"/"+cItem.code===path);
                // if(cItem){
                //     this.openKey = item.code;
                // }
                return (
                    <SubMenu
                        key={item.muenid}
                        title={
                            <span>
                                <span className={item.icon?"icon-font "+item.icon:""}></span>
                                <span>{item.muenName}</span>
                            </span>
                        }
                    >
                        {
                            item.children.map((item,index)=>{
                                return (
                                    <Menu.Item key={item.uri.split('/')[0] == "" ? item.uri : '/'+item.uri}>
                                        <Link to={item.uri.split('/')[0] == "" ? item.uri : '/'+item.uri}>{item.muenName}</Link>
                                    </Menu.Item>
                                 )
                            })
                        }

                    </SubMenu>
                )
            }else {
                return (
                    <Menu.Item key={'/'+item.muenid}>
                        <Link to={'/'+item.code}>
                            <span className={item.icon?"icon-font "+item.icon:"icon-font icon-bill"}></span>
                            <span>{item.muenName}</span>
                        </Link>
                    </Menu.Item>
                )
            }
        })
    }


    render() {
        const {userData}=this.props
        console.log(userData)
        let path = this.props.history.location.pathname;
        // if(path.indexOf('/personalCenter')===0||path==='/'){
        //     path='/personalCenter'
        // }else if(path.indexOf('/roleAdd')===0){
        //     path='/roleList'
        // }else if(path.indexOf('/dealerList')===0){
        //     path='/dealerList'
        // }else if(path.indexOf('/roleList')===0){
        //     path='/roleList'
        // }else if(path.indexOf('/staffList')===0){
        //     path='/staffList'
        // }else if(path.indexOf('/dishesList')===0){
        //     path='/dishesList'
        // }else if(path.indexOf('/couponManagement')===0){
        //     path='/couponManagement'
        // }else if(path.indexOf('/bannerList')===0){
        //     path='/bannerList'
        // }else if(path.indexOf('/storeList')===0){
        //     path='/storeList'
        // }

        return (
            <Sider className='siderWrapper'>
                <div className='sideHeader'>
                    <img src={userData.logo?userData.logo:require('../../assets/images/logo.png')} alt='' />
                    <span>言川点餐</span>
                </div>
                <Menu
                    className='siderMenu'
                    selectedKeys={[path]}
                    mode="inline"
                >
                    {
                        this.getMenuNodes()
                    }
                </Menu>
            </Sider>
        )
    }
    componentDidMount() {
        let params={
            parentId: -1,
            menuType: 2,
            groupId:sessionStorage.getItem('groupId')
        }
        this.props.getMenuData(params);
    }

}
const mapDispatch = (dispatch)=>{
    return {
        getMenuData(params){
            const action = getMenuAction(params)
            dispatch(action)
        }
    }
}

const mapState = (state)=>{
    return {
        menuList: state.userData.menuList,
        userData:state.userData.userData
    }
}

export default connect(mapState,mapDispatch)(withRouter(LeftNav));