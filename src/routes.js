import React, { lazy } from "react";
import { Router } from "@reach/router";
import { css } from "@emotion/core";
import VerifyParent from "./pages/accounts/verifyParent";
const SentMagicLink = lazy(() => import("./pages/accounts/sentMagicLink"));
const MagicLinkWithNav = lazy(() => import("./pages/accounts/magicLinkPage"));
const Splash = lazy(() => import("./pages/splash"));
const Director = lazy(() => import("./pages/director"));
const Admin = lazy(() => import("./pages/admin"));
const Login = lazy(() => import("./pages/accounts/login"));
const Participant = lazy(() => import("./pages/participant"));

const PrivacyPolicy = lazy(() => import("./pages/support/privacy"));
const TermsOfService = lazy(() => import("./pages/support/tos"));

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
      <VerifyParent path="parentVerify" />
      <SentMagicLink path="sentMagicLink" />
      <MagicLinkWithNav path="magicLink" />
      <Director path="/director/*" />
      <Admin path="/admin/*" />
      <PrivacyPolicy path="privacyPolicy" />
      <TermsOfService path="termsOfService" />
    </Router>
  );
};
export default Routes;
