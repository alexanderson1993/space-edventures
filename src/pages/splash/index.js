import React from "react";
import { Link, Center, Button } from "../../components";

const Splash = () => {
  return (
    <Center>
      <h1 className="text-center">
        Join the Space Center community and track your rank!
      </h1>
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
          Are you a Space Center Director{" "}
          <Link to="/director">Sign in Here</Link>
        </p>
      </div>
    </Center>
  );
};
export default Splash;
