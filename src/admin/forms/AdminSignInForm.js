/*************************************************************************
AdminSignInForm.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - Form the Space Center Directors will use to log in to the site (after already having created an account)
*************************************************************************/
import React from 'react';

class AdminSignInForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    handleSubmit (event) {
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div><label>Email: </label><input type='email' /></div>
                <div><label>Password: </label><input type='password' /></div>
                <div><input type='submit' value='Sign In' /></div>
            </form>
        );
    }
}

export default AdminSignInForm