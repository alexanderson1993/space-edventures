import React, { lazy } from "react";
import { Router } from "@reach/router";
const SentMagicLink = lazy(() => import("./pages/accounts/sentMagicLink"));
const MagicLinkWithNavigator = lazy(() =>
  import("./pages/accounts/magicLinkPage")
);
const Splash = lazy(() => import("./pages/splash"));
const Admin = lazy(() => import("./pages/director"));
const Login = lazy(() => import("./pages/accounts/login"));
const Participant = lazy(() => import("./pages/participant"));
const GraphQL = lazy(() => import("./pages/test/graphql"));

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
    </Router>
  );
};
export default Routes;
