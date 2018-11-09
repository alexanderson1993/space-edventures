import React from "react";
import { Router } from "@reach/router";
import Splash from "./pages/splash";
import Admin from "./pages/director";
import Login from "./pages/accounts/login";

const NotFound = () => <div>Sorry, nothing here.</div>;

const Routes = () => {
  return (
    <Router>
      <Splash path="/" />
      <Admin path="/director/*" />
      <Login path="login" />
      <NotFound default />
    </Router>
  );
};
export default Routes;
