/*************************************************************************
AdminSignUpForm.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - Form the Space Center Directors will use to sign up and create an account
*************************************************************************/
import React from 'react';

class FormAdminSignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    handleSubmit (event) {
        event.preventDefault();
        // Show the register space center page
        console.log('test');
        this.props.setPage(this.props.submitPage);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div><label>Email: </label><input type='email' /></div>
                <div><label>Password: </label><input type='password' /></div>
                <div><label>Confirm Password: </label><input type='password' /></div>
                <div><input type='submit' value='Create Account' /></div>
            </form>
        );
    }
}

export default FormAdminSignUp;