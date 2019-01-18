import React from "react";
import "./style.scss";
import PropTypes from "prop-types";

import { ThemeProvider, createTheme } from "@arwes/arwes";
import { SoundsProvider, createSounds } from "@arwes/sounds";
import createAppTheme from "../helpers/createAppTheme";

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

const normalTheme = createAppTheme({
  typography: {
    headerSizes: {
      h1: 44
    }
  }
});

const ArwesProvider = ({ children, isAdmin }) => (
  <>
    <link
      href="https://fonts.googleapis.com/css?family=Electrolize|Titillium+Web"
      rel="stylesheet"
    />
    <ThemeProvider theme={createTheme(normalTheme)}>
      <SoundsProvider sounds={createSounds(sounds)}>{children}</SoundsProvider>
    </ThemeProvider>
  </>
);

ArwesProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ArwesProvider;
