/*************************************************************************
Admin.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - Sort of a starting point for the Admin (Space Center Directory) Pages
*************************************************************************/
import React from "react";
import { Button, Link } from "../../components";

export default () => {
  let style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };

  return (
    <>
      <h1>Connect Your Space Center to the Space EdVentures Community</h1>
      <div>
        <Link to="/director/signUp">
          <Button>Join Now</Button>
        </Link>
      </div>
      <div id="splashPoints">
        <ul>
          <li>Integrate with Thorium Controls</li>
          <li>Award badges and Commendations</li>
          <li>Give your participants access to the space EdVentures Portal</li>
        </ul>
      </div>
      <div>
        <Link to="/director/details">See More Details</Link>
      </div>
      <div>
        <Link to="/director/signUp">
          <Button>Sign Up</Button>
        </Link>
        <Link to="/director/signIn">
          <Button>Sign In</Button>
        </Link>
      </div>
      <div>
        <p>
          Don't have a Space Center? <Link to="/">Sign in Here</Link>
        </p>
      </div>
    </>
  );
};
