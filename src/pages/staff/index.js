import React from "react";
import { Router } from "@reach/router";
import { Link, Words, Content } from "../../components";

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
    <Content>
      <Router>
        <NotFound default />
      </Router>
    </Content>
  );
};
