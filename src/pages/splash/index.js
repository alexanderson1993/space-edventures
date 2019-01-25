import React from "react";
import { Link, Center, Button, Content } from "../../components";
import styled from "@emotion/styled";

const Header = styled("h1")`
  text-align: center;
`;

const Splash = () => {
  return (
    <Content>
      <Center>
        <Header className="text-center">
          Join the Space Center community and track your rank!
        </Header>
        <div>
          <Link to="/login">
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
          <Link to="/login">
            <Button>Sign Up</Button>
          </Link>
          <Link to="/login">
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
