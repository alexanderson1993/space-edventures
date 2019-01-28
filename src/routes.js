import React, { lazy } from "react";
import { Router } from "@reach/router";
import { css } from "@emotion/core";
const SentMagicLink = lazy(() => import("./pages/accounts/sentMagicLink"));
const MagicLinkWithNav = lazy(() => import("./pages/accounts/magicLinkPage"));
const Splash = lazy(() => import("./pages/splash"));
const Admin = lazy(() => import("./pages/director"));
const Login = lazy(() => import("./pages/accounts/login"));
const Participant = lazy(() => import("./pages/participant"));
const GraphQL = lazy(() => import("./pages/test/graphql"));

const Routes = () => {
  return (
    <Router
      css={css`
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
      `}
    >
      <Splash path="/" />
      <Participant path="/*" />
      <Login path="login" />
      <SentMagicLink path="sentMagicLink" />
      <MagicLinkWithNav path="magicLink" />
      <GraphQL path="graphql" />
      <Admin path="/director/*" />
    </Router>
  );
};
export default Routes;
