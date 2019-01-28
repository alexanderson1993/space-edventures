import React from "react";
import Link from "../components/Link";
import { Header } from "@arwes/arwes";
import Profile from "./profile";
import { ReactComponent as Logo } from "../assets/img/logo.svg";
import AnimateContext from "../helpers/animateContext";

const TopHeader = () => (
  <AnimateContext.Consumer>
    {({ show }) => (
      <Header animate show={show}>
        <div
          style={{
            margin: "0 auto",
            maxWidth: 960,
            padding: "0.5rem 1.0875rem",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none"
            }}
          >
            <Logo style={{ maxWidth: "200px" }} />
          </Link>
          <Profile />
        </div>
      </Header>
    )}
  </AnimateContext.Consumer>
);

export default TopHeader;
