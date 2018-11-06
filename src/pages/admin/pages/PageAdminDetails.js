import React from 'react';
import {Link} from '@reach/router';

class PageAdminDetails extends React.Component {
    render() {
        console.log('test');
        return <React.Fragment>
            <h1>Space Center Directory Information</h1>
            <ul>
                <li>In order to participate in the Space EdVentures Community, your Space Center will need to run the Thorium Simulation Controls. <a href='https://thoriumsim.com'>Visit Website</a></li>
            </ul>
            <Link to='../signup'>Sign Up</Link>
        </React.Fragment>
    }
}

export default PageAdminDetails;