import React,{Component} from 'react';
import {Route,Switch,Redirect} from 'react-router-dom';
import { Layout, Menu,Modal,Icon,Dropdown,message } from 'antd';
import LeftNav from '../../components/leftNav';
import Headers from '../../components/header';
import {Link,withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getMenuAction} from "../../store/actionCreators";
import {logout} from '../../api';

import BannerRouter from '../banner/Router';
import BillList from '../bill/BillList';
import DishesCategory from '../dishes/DishesCategory';
import CategoryList from '../dishes/CategoryList';
import LabelList from '../label/LabelList';
import OddBillList from '../odd/OddBillList';
import StoreRouter from '../store/Router';
import TransferList from '../transfer/TransferList';
import AuthorityList from '../user/AuthorityList';
import OrderList from '../order/OrderList';
import ReservationList from '../order/ReservationList';
import DishesRouter from '../dishes/list/Router';
import CenterRouter from '../center/Router';
import DealerRouter from '../dealer/Router';
import RoleRouter from '../user/role/Router';
import StaffRouter from '../user/staff/Router';
import CouponRouter from '../coupon/Router';
import NoFound from '../404/index';
import PersonalCenter from "../center/PersonalCenter";

const {Content,Header, Sider} = Layout;
const { SubMenu } = Menu;
const { confirm } = Modal;

// logout=()=>{
//   sessionStorage.removeItem('token')
//   this.props.history.push('/login')
// }
class Admin extends Component{
	state = {
    collapsed: false,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
	};
	getHeadMenu=()=>{
		const menuList =this.props.menuList;
		console.log(menuList)
		return menuList.map((item)=>{
			if(item.parentMuenId == 0 && item.muenid != 41){
				return (
						<Menu.Item key={'/' + item.children[0].uri} >
							<Link to={'/' +item.children[0].uri}>{item.muenName}</Link>
						</Menu.Item>
				)
			}if(item.parentMuenId == 0 && item.muenid == 41){
				return (
					<Menu.Item key={ item.children[0].uri}>
						<Link to={ item.children[0].uri}>{item.muenName}</Link>
					</Menu.Item>
			)
			}
		})
	}
	getMenuNodes=()=>{
		const menuList =this.props.menuList;
		return menuList.map((item)=>{
			if(item.children.length>0 && item.children.parentMuenId == item.muenid){
				return(
					<Menu>
						{
							item.children.map((item,index)=>{
								return (
									<Menu.Item key={item.uri.split('/')[0] == "" ? item.uri : '/'+item.uri}>
										<Link to={item.uri.split('/')[0] == "" ? item.uri : '/'+item.uri}>{item.muenName}</Link>
									</Menu.Item>
								)
							})
						}
					</Menu>
				)
			}
			if(item.children.length>0){
				return (
					<SubMenu
						key={item.muenid}
						title={
							<span>
								<Icon type="appstore" />
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
				}
				else {
					return (
						<Menu.Item key={item.uri.split('/')[0] == "" ? item.uri : '/'+item.uri}>
							<Link to={item.uri.split('/')[0] == "" ? item.uri : '/'+item.uri}>
								<Icon type="appstore" />
								<span>{item.muenName}</span>
							</Link>
						</Menu.Item>
					)
				}
		})
	}
	logout=()=>{
		confirm({
			title: '您确定退出登录吗?',
			onOk:() => {
				logout().then(res => {
					if(res.data.code == 200){
							message.success(res.data.message);
							sessionStorage.clear();
							sessionStorage.removeItem('Authorization')
							this.props.history.replace('/login')
					}else{
							message.error(res.data.message);
					}
			}).catch(err => {
			});
			
			}
		});
	}
  // logout=()=>{
  //   // const token = sessionStorage.getItem('token')
  //   sessionStorage.removeItem('token')
  //   this.props.history.push('/login')
  // }
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a>
            修改密码
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.logout}>
            退出登录
            </a>
        </Menu.Item>
      </Menu>
    );
		const {userData}=this.props
		let path = this.props.history.location.pathname;
		const userName = sessionStorage.getItem('userName')
    return (
      <Layout className='adminWrapper' >
				<Sider className='siderWrapper' trigger={null} collapsible collapsed={this.state.collapsed}>
        {/* <div className='sideHeader'>
        <img src={userData.logo?userData.logo:require('../../assets/images/logo.png')} alt='' />
        <span>言川点餐</span>
        </div> */}
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
        <Layout>
					<Header className='headerWrapper'>
						<Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
						<Menu
							className="headMenu"
							mode="horizontal"
							selectedKeys={[path]}
						>
							{this.getHeadMenu()}
						</Menu>
						<Dropdown overlay={menu} className="name">

							<a className="ant-dropdown-link" href="#">
								{userName} <Icon type="down" />
							</a>
						</Dropdown>
					</Header>
          {/* <Headers /> */}
          <Content className='contentWrapper'>
            <Switch>
              {/* <Redirect exact={true} from='/' to='/personalCenter' />
              <Route path="/" component={PersonalCenter} exact /> */}
              <Route path="/billList" component={BillList} />
              <Route path="/bannerList" component={BannerRouter} />
              <Route path="/personalCenter" component={CenterRouter} />
              <Route path="/authorityList" component={AuthorityList} />
              <Route path="/orderList" component={OrderList} />
              <Route path="/reservationList" component={ReservationList} />
              <Route path="/roleList" component={RoleRouter} />
              <Route path="/staffList" component={StaffRouter} />
              <Route path="/storeList" component={StoreRouter} />
              <Route path="/dishesCategory" component={DishesCategory} />
              <Route path="/categoryList" component={CategoryList} />
              <Route path="/dishesList" component={DishesRouter} />
              <Route path="/labelList" component={LabelList} />
              <Route path="/dealerList" component={DealerRouter} />
              <Route path="/couponManagement" component={CouponRouter} />
              <Route path="/transferList" component={TransferList} />
              <Route path="/oddBillList" component={OddBillList} />
              <Route component={NoFound} />
            </Switch>
          </Content>
      </Layout>
    </Layout>
  )
}
	componentDidMount() {
		let params={
			// parentId: -1,
			// menuType: 2,
			// groupId:sessionStorage.getItem('groupId')
		}
		this.props.getMenuData(params);
	}
}
// export default Admin;
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

export default connect(mapState,mapDispatch)(withRouter(Admin));