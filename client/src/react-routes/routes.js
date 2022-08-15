import React, { useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
import PrivateRoute from './privateRoute';
import Login from '../components/login/Login'
import Home from '../components/login/Home';
import Info from '../components/info/Info';
import AuthRoute from './authRoute';

function Routes(props) {
    return (
        <Switch>
            <PrivateRoute
                path="/"
                exact
                component={Home}
            />
            <AuthRoute
                path="/login"
                exact
                component={Login}
            />
            <PrivateRoute
                path="/private-page"
                exact
                component={Info}
            />
            <Route
                path="*"
                component={() => "404 NOT FOUND"}
            />
        </Switch>
    )

}

export default Routes;