import React, { lazy } from "react";
import { Router } from "@reach/router";
import { Link, Words } from "../../components";
const Certificate = lazy(() => import("./certificate"));
const Profile = lazy(() => import("./profile"));

const NotFound = () =>
  console.log("rendered") || (
    <div>
      <h1>
        <Words>Sorry, nothing here.</Words>
      </h1>
      <h2>
        <Link to="/">
          <Words>Go home</Words>
        </Link>
      </h2>
    </div>
  );

export default () => {
  return (
    <Router>
      <Profile path="profile" />
      <Certificate path="certificate" />
      <NotFound default />
    </Router>
  );
};
