import React, { lazy } from "react";
import { Router } from "@reach/router";
import { Link, Words, Content } from "../../components";
import Auth from "../../components/Auth";
const Menu = lazy(() => import("./menu"));
const CoppaVerify = lazy(() => import("./coppaVerify"));

const NotFound = () => (
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
    <Auth roles={["admin"]}>
      <Content>
        <Router>
          <Menu path="/" />
          <CoppaVerify path="verify" />
          <NotFound default />
        </Router>
      </Content>
    </Auth>
  );
};
