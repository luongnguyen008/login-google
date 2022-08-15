
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Route, Redirect } from 'react-router-dom';
import { getCookie, setCookie } from '../helpers/config';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const PrivateRoute = ({ component: Component, ...rest }) => {
    // const auth = useSelector(state => state.auth)
    const [isAuthenticated, setIsAuthenticated] = useState(null)  
    useEffect(() => {
        let access_token = getCookie("access_token")
        let refresh_token = getCookie("refresh_token")
        console.log("access_token", access_token)
            if(!access_token || !refresh_token){
                // let tokenExpiration = jwtDecode(access_token).exp;
                // let dateNow = new Date();
                // console.log("tokenExpiration", tokenExpiration)
                // console.log("dateNow.getTime()/1000", dateNow.getTime()/1000)
                // console.log(tokenExpiration < dateNow.getTime()/1000)
                // if(tokenExpiration < dateNow.getTime()/1000)
                setIsAuthenticated(false)
                
            } else {
                if(access_token) {
                    setIsAuthenticated(true)
                } else {
                    if(refresh_token) {
                        axios.post("http://localhost:5000/api/auth/refresh-token", {data: refresh_token})
                        .then((res) => {
                            console.log("res.data", res.data)
                            setCookie("access_token", res.data, 0.001)
                            setIsAuthenticated(true)
                        })
                        .catch((err) => {
                            setIsAuthenticated(false)
                        })
                    }else {
                        setIsAuthenticated(false)
                    }
                }
                
            }
        // eslint-disable-next-line
    }, [])

    if(isAuthenticated === null){
        return <></>
    }

    return (
        <Route {...rest} render={props => {
            if(!isAuthenticated) {
                return <Redirect to='/login'/>
            } else {
                return <Component {...props} />
            }
        }}
        />
    );
};

export default PrivateRoute;



