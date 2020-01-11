import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import CouponList from './CouponList';
import WrapAddUpdate from './CouponAdd';

class CenterRouter extends Component{
    render() {
        return (
            <Switch>
                <Route path="/couponManagement" component={CouponList} exact />
                <Route path='/couponManagement/add' component={WrapAddUpdate} />
                <Redirect  to='/couponManagement' />
            </Switch>
        )
    }
}

export default CenterRouter;