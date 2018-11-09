import React from "react";
import { Router } from "@reach/router";
import Splash from "./splash";
import SignUp from "./signUp";
import SignIn from "./signIn";
import Details from "./details";
import Register from "./register";
export default () => {
  return (
    <Router>
      <Splash path="/" />
      <SignUp path="signUp" />
      <SignIn path="signIn" />
      <Details path="details" />
      <Register path="register" />
    </Router>
  );
};