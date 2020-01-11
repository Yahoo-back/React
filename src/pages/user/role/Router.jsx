import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import RoleList from './RoleList';
import AddUpdate from './AddUpdate';

class RoleRouter extends Component{
    render() {
        return (
            <Switch>
                <Route path="/roleList" component={RoleList} exact />
                <Route path='/roleList/addUpdate' component={AddUpdate} />
                <Redirect  to='/roleList' />
            </Switch>
        )
    }
}

export default RoleRouter;