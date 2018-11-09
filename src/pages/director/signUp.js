import React from "react";
import { Button, Link } from "../../components";
import Login from "../accounts/login";
export default () => {
  return (
    <>
      <h1>Director Sign Up</h1>
      <Login signUp to="/director/register" />
      or
      <div>
        <Link to="/director/signIn">
          <Button>Sign In</Button>
        </Link>
      </div>
    </>
  );
};
