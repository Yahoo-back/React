import React,{Component} from 'react';
import {HashRouter,Route,Switch,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as contants from './store/actionTypes';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';

class App extends Component{
    render() {
        const {userData} = this.props;
        console.log(this.props.userData.Authorization)
        return (
            <HashRouter>
                <Switch>
                    <Route
                        exact
                        path='/'
                        render={
                            userData.Authorization?()=><Route path="/" component={Admin} />:()=><Redirect to='/login' push />
                        }
                    />
                    <Route path="/login" component={Login} exact/>
                    <Route path="/" component={Admin} />
                </Switch>
            </HashRouter>
        )
    }
    componentDidMount() {
        this.props.reqLocalData()
    }
}


const mapState = (state)=>{
    return {
        userData:state.userData.userData
    }
}
const mapDispatch=(dispatch)=>{
    return {
        reqLocalData(){
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            dispatch({
                type:contants.LOGIN_DATA,
                userData:userData?userData:{}
            })
        }
    }
}


export default connect(mapState,mapDispatch)(App);
