import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import StaffList from './StaffList';
import AddUpdate from './AddUpdate';

class StaffRouter extends Component{
    render() {
        return (
            <Switch>
                <Route path="/staffList" component={StaffList} exact />
                <Route path='/staffList/addUpdate' component={AddUpdate} />
                <Redirect  to='/staffList' />
            </Switch>
        )
    }
}

export default StaffRouter;