import React from 'react';
import PropTypes from 'prop-types';
import { clearCookie } from '../../helpers/config';
import { useHistory } from 'react-router-dom';
Home.propTypes = {
    
};

function Home(props) {
    const history = useHistory()
    const handleLogout = () => {
        clearCookie("access_token")
        clearCookie("refresh_token")
        history.push("/login")
    }
    return (
        <div>
            <h3>Home page</h3>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}

export default Home;