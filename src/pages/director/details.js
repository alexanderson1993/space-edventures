import React from "react";
import { Button, Link } from "../../components";

export default () => {
  return (
    <>
      <h1>Space Center Directory Information</h1>
      <ul>
        <li>
          In order to participate in the Space EdVentures Community, your Space
          Center will need to run the Thorium Simulation Controls.{" "}
          <Link to="https://thoriumsim.com">View Website</Link>
        </li>
      </ul>
      <Link to="/director/signIn">
        <Button>Join Now</Button>
      </Link>
    </>
  );
};
