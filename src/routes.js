import React from 'react';
import {Router} from "@reach/router";
import Splash from './pages/splash';
import Admin from './pages/admin';

const Routes = () => {
    return <Router>
        <Splash path="/" />
        <Admin path="admin/*" />
    </Router>
}
export default Routes;