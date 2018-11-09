import React from "react";
import { Link } from "../../components";

const Splash = () => {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Link to="/director">View Admin Pages</Link>
    </div>
  );
};
export default Splash;
