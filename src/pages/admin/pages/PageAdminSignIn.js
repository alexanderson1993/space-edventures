import React from 'react';
import FormAdminSignIn from '../forms/FormAdminSignIn';
import {Link} from '@reach/router';

class PageAdminSignIn extends React.Component {
    render() {
        return <React.Fragment>
            <h1>Director Sign In</h1>
            <p>or <Link to='../signup'>Sign Up</Link></p>
            <FormAdminSignIn />
        </React.Fragment>
    }
}

export default PageAdminSignIn;