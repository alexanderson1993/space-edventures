/*************************************************************************
Admin.js
CREATED: 2018.11.3 (TarronLane)
NOTES:
    - Sort of a starting point for the Admin (Space Center Directory) Pages
*************************************************************************/
import React from "react";
import { Button, Link, Center, Content } from "../../components";

export default () => {
  return (
    <Content>
      <Center>
        <h1 className="text-center">
          Connect Your Space Center to the Space EdVentures Community
        </h1>

        <div>
          <Link to="/login">
            <Button>Join Now</Button>
          </Link>
        </div>
        <div className="splashPoints">
          <ul>
            <li>Integrate with Thorium Controls</li>
            <li>Award badges and Commendations</li>
            <li>
              Give your participants access to the space EdVentures Portal
            </li>
          </ul>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <ul>
            <li>
              In order to participate in the Space EdVentures Community, your
              Space Center will need to run the Thorium Simulation Controls.{" "}
              <Link to="https://thoriumsim.com" target="_blank">
                View Website
              </Link>
            </li>
          </ul>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            maxWidth: "50%",
            width: "60vw"
          }}
        >
          <Link to="/login?signUp">
            <Button>Sign Up</Button>
          </Link>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
        <div style={{ marginTop: "30px" }}>
          <p>
            Don't have a Space Center? <Link to="/">Sign Up Here</Link>
          </p>
        </div>
      </Center>
    </Content>
  );
};
