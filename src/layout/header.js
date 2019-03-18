import React from "react";
import Link from "../components/Link";
import { Header } from "@arwes/arwes";
import Profile from "./profile";
import { ReactComponent as Logo } from "../assets/img/logo.svg";
import AnimateContext from "../helpers/animateContext";
import css from "@emotion/css";

const TopHeader = ({ show }) => (
  <AnimateContext.Consumer>
    {({ show: contextShow }) => {
      const realShow = show || show === false ? show : contextShow;
      return (
        <Header animate show={realShow}>
          <div
            css={css`
              margin: 0 auto;
              max-width: 960px;
              padding: 0.5rem 1.0875rem;
              display: flex;
              justify-content: space-between;
              transition: opacity 0.2s ease;
              opacity: ${realShow ? 1 : 0};
            `}
          >
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none"
              }}
            >
              <Logo css={{ maxWidth: "200px", width: "100%" }} />
            </Link>
            <Profile />
          </div>
        </Header>
      );
    }}
  </AnimateContext.Consumer>
);

export default TopHeader;
