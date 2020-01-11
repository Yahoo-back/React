import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import DealerList from './DealerList';
import WrapDealerAdd from './DealerAddUpdata';

class DealerRouter extends Component{
    render() {
        return (
            <Switch>
                <Route path="/dealerList" component={DealerList} exact />
                <Route path='/dealerList/dealer' component={WrapDealerAdd} />
                <Redirect  to='/dealerList' />
            </Switch>
        )
    }
}

export default DealerRouter;