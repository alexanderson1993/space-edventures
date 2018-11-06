/*************************************************************************
Admin.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - Sort of a starting point for the Admin (Space Center Directory) Pages
*************************************************************************/
import React from "react";
import {Router} from "@reach/router";

// Pages
import PageAdminSignIn from './pages/PageAdminSignIn'; 
import PageAdminSignUp from './pages/PageAdminSignUp'; 
import PageAdminDetails from './pages/PageAdminDetails'; 
import PageRegisterCenter from './pages/PageRegisterCenter';
import PageAdminHome from './pages/PageAdminHome';


class AdminHome extends React.Component {

    constructor(props) {
        super(props);
        // Acts like a constant... I couldn't figure out a good way to do constants in React so if you know, feel free to change
        this.state = {}
    }

    render() {
        console.log('renders admin');
        let style = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'

        };

        return (
            <div style={style} className='app'>
                <Router>
                    <PageAdminHome path='/' />
                    <PageAdminSignIn path='signin' />
                    <PageAdminSignUp path='signup' />
                    <PageAdminDetails path='details' />
                    <PageRegisterCenter path='register' />
                </Router>
            </div>
        );
    }
}

export default AdminHome;