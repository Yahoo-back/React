import React,{Component} from 'react';
import {Route,Switch,Redirect} from "react-router-dom";
import DishesList from './DishesList';
import AddUpdate from './AddUpdate';

class DishesRouter extends Component{
    render() {
        return (
            <Switch>
                <Route path="/dishesList" component={DishesList} exact />
                <Route path='/dishesList/addUpdate' component={AddUpdate} />
                <Redirect  to='/dishesList' />
            </Switch>
        )
    }
}

export default DishesRouter;