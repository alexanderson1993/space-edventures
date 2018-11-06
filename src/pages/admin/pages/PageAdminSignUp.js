import React from 'react';
import {Link} from '@reach/router';
import FormAdminSignUp from '../forms/FormAdminSignUp';

class PageAdminSignUp extends React.Component {
    render() {
        return <React.Fragment>
            <h1>Director Sign Up</h1>
            <p>or <Link to='../signin'>Sign In</Link></p>
            <FormAdminSignUp setPage={this.setPage} />
        </React.Fragment>
    }
}

export default PageAdminSignUp;