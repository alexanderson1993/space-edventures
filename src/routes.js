import React, { lazy } from "react";
import { Router } from "@reach/router";
import SentMagicLink from "./pages/accounts/sentMagicLink";
import MagicLinkWithNavigator from "./pages/accounts/magicLink";
const Splash = lazy(() => import("./pages/splash"));
const Admin = lazy(() => import("./pages/director"));
const Login = lazy(() => import("./pages/accounts/login"));
const Participant = lazy(() => import("./pages/participant"));
const GraphQL = lazy(() => import("./pages/test/graphql"));

const NotFound = () => <div>Sorry, nothing here.</div>;

const Routes = () => {
  return (
    <Router>
      <Splash path="/" />
      <Participant path="/*" />
      <Admin path="/director/*" />
      <Login path="login" />
      <SentMagicLink path="sentMagicLink" />
      <MagicLinkWithNavigator path="magicLink" />
      <GraphQL path="graphql" />
      <NotFound default />
    </Router>
  );
};
export default Routes;
