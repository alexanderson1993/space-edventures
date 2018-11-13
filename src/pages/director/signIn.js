import React from "react";
import { Button, Link } from "../../components";
import Login from "../accounts/login";
export default () => {
  return (
    <>
      <h1>Director Sign In</h1>
      <Login />
      or
      <div>
        <Link to="/director/signUp">
          <Button>Sign Up</Button>
        </Link>
      </div>
    </>
  );
};
