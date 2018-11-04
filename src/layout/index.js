import React from "react";
import { Link } from "@reach/router";
import Profile from "./profile";
import { ReactComponent as Logo } from "./logo.svg";
import "./style.scss";

const Layout = ({ children }) => {
  // Layout includes
  // - Global navigation
  // - User Profile link
  // - Frame
  // It should also be changable, in case we
  // feel like mixing it up.
  const alertColor = "5";
  return (
    <div className={`layout-line alertColor${alertColor}`}>
      <header>
        <Link to="/">
          <div className="logo">
            <Logo />
          </div>
        </Link>
        <menu>
          <Link to="about">About</Link>
          <Link to="centers">Centers</Link>
          <Link to="badges">Badges</Link>
        </menu>
        <Profile />
      </header>
      <main>{children}</main>
    </div>
  );
};
export default Layout;
