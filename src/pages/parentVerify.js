import React from "react";
import { Router } from "@reach/router";
import { Content } from "../components";
import lazy from "../helpers/lazy";

const VerifyParent = lazy(() => import("../routes/verifyParent/index"));

export default () => {
  return (
    <Content>
      <Router>
        <VerifyParent path="/parentVerify" />
      </Router>
    </Content>
  );
};
