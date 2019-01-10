import React, { lazy } from "react";
import { Router } from "@reach/router";
const Profile = lazy(() => import("./profile"));
export default () => {
  return (
    <Router>
      <Profile path="profile" />
    </Router>
  );
};
