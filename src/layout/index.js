import React from "react";
import { Link } from "@reach/router";
import Profile from "./profile";
import { ReactComponent as Logo } from "./logo.svg";
import "./style.scss";

const corner = `url(${require("./img/corner.png")})`;
const slant = `url(${require("./img/slant.png")})`;
const bottom = `url(${require("./img/bottom.png")})`;
const cornerSlant = `url(${require("./img/corner-slant.png")})`;
const side = `url(${require("./img/side.png")})`;
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
      <div className={`layout-images`}>
        <div className={`top-corner`} style={{ backgroundImage: corner }} />
        <div className={`top-slant`} style={{ backgroundImage: slant }} />
        <div
          className={`top-horizontal-1`}
          style={{ backgroundImage: bottom }}
        />
        <div
          className={`top-horizontal-2`}
          style={{ backgroundImage: bottom }}
        />
        <div className={`top-right`} style={{ backgroundImage: cornerSlant }} />
        <div className={`side-left`} style={{ backgroundImage: side }} />
        <div className={`side-right`} style={{ backgroundImage: side }} />
        <div
          className={`bottom-left`}
          style={{ backgroundImage: cornerSlant }}
        />
        <div className={`bottom-right`} style={{ backgroundImage: corner }} />
        <div
          className={`bottom-horizontal`}
          style={{ backgroundImage: bottom }}
        />
      </div>
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
      <main className="content">{children}</main>
    </div>
  );
};
export default Layout;
