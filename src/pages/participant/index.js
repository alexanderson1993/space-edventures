import React from "react";
import { Router } from "@reach/router";
import Profile from "./profile";
export default () => {
  return (
    <Router>
      <Profile path="profile" />
    </Router>
  );
};
