import React from 'react';
import {Link} from '@reach/router';

class PageAdminHome extends React.Component {
    render() {
        return <>
            <h1>Connect Your Space Center to the Space EdVentures Community</h1>
            <div>
                <Link to='signup'>Join Now</Link>
            </div>
            <div id='splashPoints'>
                <ul>
                    <li>Integrate with Thorium Controls</li>
                    <li>Award badges and Commendations</li>
                    <li>Give your participants access to the space EdVentures Portal</li>
                </ul>
            </div>
            <div>
                <Link to='details'>More Information</Link>
            </div>
            <div>
                <Link to='signup'>Sign Up</Link>
                <Link to='signin'>Sign In</Link>
            </div>
            <div>
                <p>Don't have a Space Center? <Link to='/'>Sign In Here</Link></p>
            </div>
        </>
    }
}

export default PageAdminHome;