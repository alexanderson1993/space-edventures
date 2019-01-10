import React, { lazy } from "react";
import { Router } from "@reach/router";
const Splash = lazy(() => import("./pages/splash"));
const Admin = lazy(() => import("./pages/director"));
const Login = lazy(() => import("./pages/accounts/login"));
const Participant = lazy(() => import("./pages/participant"));

const NotFound = () => <div>Sorry, nothing here.</div>;

const Routes = () => {
  return (
    <Router>
      <Splash path="/" />
      <Participant path="/*" />
      <Admin path="/director/*" />
      <Login path="login" />
      <NotFound default />
    </Router>
  );
};
export default Routes;
