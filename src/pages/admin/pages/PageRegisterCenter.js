/*************************************************************************
PageRegisterCenter.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - Screen the new Directors will see after choosing an email and password
*************************************************************************/
import React from 'react';
import {FormRegisterCenter} from '../forms';

/**
 * Props: array Pages, function setPages
 */
class PageRegisterCenter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h1>Register Your Space Center</h1>
                <FormRegisterCenter setPage={this.props.setPage} cancelPage={this.props.pages.signUp} />
            </React.Fragment>
        );
    }
}

export default PageRegisterCenter;