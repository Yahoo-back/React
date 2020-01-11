import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import PersonalCenter from './PersonalCenter';
import WrapPassword from './Password';

class CenterRouter extends Component{
    render() {
        return (
            <Switch>
                <Route path="/personalCenter" component={PersonalCenter} exact />
                <Route path='/personalCenter/password' component={WrapPassword} />
                <Redirect  to='/personalCenter' />
            </Switch>
        )
    }
}

export default CenterRouter;