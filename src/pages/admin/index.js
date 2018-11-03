/*************************************************************************
Admin.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - Sort of a starting point for the Admin (Space Center Directory) Pages
*************************************************************************/
import React from "react";
import {Button,Link} from '../../components';
import {AdminSignInForm, AdminSignUpForm} from './forms';
import {PageRegisterCenter} from './pages';

class AdminHome extends React.Component {

    constructor(props) {
        super(props);
        // Acts like a constant... I couldn't figure out a good way to do constants in React so if you know, feel free to change
        this.pages = {
            home: 'home',
            details: 'details',
            signUp: 'signup',
            signIn: 'signin',
            registerCenter: 'registercenter'
        }
        this.state = {
            showPage: this.pages.home
        }

        // Bind this
        this.setPage = this.setPage.bind(this);
    }

    /**
     * Function setPage
     * @param {string pageName} pageName needs to match one of the pages defined in the constructor
     */
    setPage (pageName) {
        this.setState({
            showPage: pageName
        });
    }

    render() {
        let style = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'

        };

        // =====================================================================
        // Home
        // =====================================================================
        let content = <React.Fragment>
            <h1>Connect Your Space Center to the Space EdVentures Community</h1>
            <div>
                <Button text='Join Now' onClick={this.setPage} onClickParam={this.pages.signUp} />
            </div>
            <div id='splashPoints'>
                <ul>
                    <li>Integrate with Thorium Controls</li>
                    <li>Award badges and Commendations</li>
                    <li>Give your participants access to the space EdVentures Portal</li>
                </ul>
            </div>
            <div>
                <Link text='See More Details' onClick={this.setPage} onClickParam={this.pages.details} />
            </div>
            <div>
                <Button text='Sign Up' onClick={this.setPage} onClickParam={this.pages.signUp} />
                <Button text='Sign In' onClick={this.setPage} onClickParam={this.pages.signIn} />
            </div>
            <div>
                <p>Don't have a Space Center? <Link onClick={this.props.goToHome} text='Sign in Here' /></p>
            </div>
        </React.Fragment>

        // Note 2018.11.3 (TarronLane)
        /**
         * The different "pages" could probably be separated out into different React components, but I wasn't sure so I just left them here for simplicity
         * Some of the pages I have actually already broken out
         */

        // =====================================================================
        // Details
        // =====================================================================
        if (this.state.showPage === this.pages.details) {
            content = <React.Fragment>
                <h1>Space Center Directory Information</h1>
                <ul>
                    <li>In order to participate in the Space EdVentures Community, your Space Center will need to run the Thorium Simulation Controls. <Link text="View Website" /></li>
                </ul>
                <Button text='Join Now' onClick={this.setPage} onClickParam={this.pages.signUp} />
            </React.Fragment>
        }
        // =====================================================================
        // Sign Up
        // =====================================================================
        else if (this.state.showPage === this.pages.signUp) {
            content = <React.Fragment>
                <h1>Director Sign Up</h1>
                <p>or <Link text='Sign In' onClick={this.setPage} onClickParam={this.pages.signIn} /></p>
                <AdminSignUpForm setPage={this.setPage} submitPage={this.pages.registerCenter} />
            </React.Fragment>
        }
        // =====================================================================
        // Sign In
        // =====================================================================
        else if (this.state.showPage === this.pages.signIn) {
            content = <React.Fragment>
                <h1>Director Sign In</h1>
                <p>or <Link text='Sign Up' onClick={this.setPage} onClickParam={this.pages.signUp} /></p>
                <AdminSignInForm />
            </React.Fragment>
        }
        else if (this.state.showPage === this.pages.registerCenter) {
            content = <PageRegisterCenter setPage={this.setPage} pages={this.pages} />
        }

        return (
            <div style={style} className='app'>
                {content}
            </div>
        );
    }
}

export default AdminHome;