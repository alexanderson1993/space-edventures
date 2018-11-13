import React from "react";
import { Link } from "@reach/router";
import Profile from "./profile";
import { ReactComponent as Logo } from "./logo.svg";
import "./style.scss";
import PropTypes from "prop-types";

import { ThemeProvider, createTheme } from "@arwes/arwes";
import { SoundsProvider, createSounds } from "@arwes/sounds";
import createAppTheme from "../helpers/createAppTheme";

import ArwesContainer from "./arwes";

const sounds = {
  shared: {
    volume: 0.6
  },
  players: {
    click: {
      sound: { src: [require("../assets/sound/click.mp3")] },
      settings: { oneAtATime: true }
    },
    typing: {
      sound: { src: [require("../assets/sound/typing.mp3")] },
      settings: { oneAtATime: true }
    },
    deploy: {
      sound: { src: [require("../assets/sound/deploy.mp3")] },
      settings: { oneAtATime: true }
    }
  }
};

const Layout = ({ children }) => (
  <>
    <link
      href="https://fonts.googleapis.com/css?family=Electrolize|Titillium+Web"
      rel="stylesheet"
    />
    <ThemeProvider theme={createTheme(createAppTheme())}>
      <SoundsProvider sounds={createSounds(sounds)}>
        <ArwesContainer>{children}</ArwesContainer>
      </SoundsProvider>
    </ThemeProvider>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
