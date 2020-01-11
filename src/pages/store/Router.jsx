import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import StoreList from './StoreList';
import WrapAddUpdate from './AddUpdate';

class StoreRouter extends Component{
    render() {
        return (
            <Switch>
                <Route path="/storeList" component={StoreList} exact />
                <Route path='/storeList/addUpdate' component={WrapAddUpdate} />
                <Redirect  to='/storeList' />
            </Switch>
        )
    }
}

export default StoreRouter;