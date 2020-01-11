import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import BannerList from './BannerList';
import WrapAddUpdate from './AddUpdate';

class BannerRouter extends Component{
    render() {
        return (
            <Switch>
                <Route path="/bannerList" component={BannerList} exact />
                <Route path='/bannerList/addUpdate' component={WrapAddUpdate} />
                <Redirect  to='/bannerList' />
            </Switch>
        )
    }
}

export default BannerRouter;