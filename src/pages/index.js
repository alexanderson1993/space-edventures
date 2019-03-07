import React, { useContext } from "react";
import { Link, Center, Button, Content } from "../components";
import styled from "@emotion/styled";
import ProfileContext from "../helpers/profileContext";

const Header = styled("h1")`
  text-align: center;
`;

const Splash = () => {
  const { user } = useContext(ProfileContext);
  if (user && user.email) {
    return (
      <Content>
        <h1>
          Welcome,{" "}
          {user.profile
            ? user.profile.displayName || user.profile.name
            : user.email}
        </h1>
        <Link to="/redeem">
          <Button>Redeem A Flight</Button>
        </Link>
        <Link to="/director">Go to the Director's page</Link>
      </Content>
    );
  }
  return (
    <Content>
      <Center>
        <Header className="text-center">
          Join the Space Center community and track your rank!
        </Header>
        <div>
          <Link to="/accounts/login">
            <Button>Join Now</Button>
          </Link>
        </div>
        <div className="splashPoints">
          <ul>
            <li>Earn Class Points</li>
            <li>Transfer Ranks between Centers</li>
            <li>Earn Badges and Commendations</li>
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
          <Link to="/accounts/login?signUp">
            <Button>Sign Up</Button>
          </Link>
          <Link to="/accounts/login">
            <Button>Sign In</Button>
          </Link>
        </div>
        <div style={{ marginTop: "30px" }}>
          <p>
            Are you a Space Center Director?{" "}
            <Link to="/director">Sign in Here</Link>
          </p>
        </div>
      </Center>
    </Content>
  );
};
export default Splash;
