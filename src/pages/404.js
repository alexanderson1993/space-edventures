import React from "react";
import { Link, Words } from "../components";

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

export default NotFound;
