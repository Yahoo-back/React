import React,{Component} from 'react';
import { Layout,Modal,Menu,Icon,Dropdown } from 'antd';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
const { Header } = Layout;
const { confirm } = Modal;
const { SubMenu } = Menu;
const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer">
        修改密码
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer"  href="/login">
        退出登录
      </a>
    </Menu.Item>
  </Menu>
);
class Headers extends Component{
	constructor(props){
		super(props)
	}
    logOut=()=>{
        confirm({
            title: '您确定退出登录吗?',
            onOk:() => {
                sessionStorage.clear();
                this.props.history.replace('/login')
            }
        });
    }


    render() {
        const userName = sessionStorage.getItem('userName')
        return (
            <Header className='headerWrapper'>
							<Dropdown overlay={menu} className="name">
								<a className="ant-dropdown-link" href="#">
									{userName} <Icon type="down" />
								</a>
							</Dropdown>
            </Header>
        )
    }
}

const mapState = (state)=>{
    return {
        userData:state.userData.userData
    }
}

export default connect(mapState,null)(withRouter(Headers));