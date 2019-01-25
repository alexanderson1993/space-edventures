import React, { useState, createContext } from "react";
import "./style.scss";
import PropTypes from "prop-types";

import { ThemeProvider, createTheme } from "@arwes/arwes";
import { SoundsProvider, createSounds } from "@arwes/sounds";
import createAppTheme from "../helpers/createAppTheme";
import Layout from "./";

export const AdminContext = createContext();

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

const baseTheme = {
  typography: {
    headerSizes: {
      h1: 44
    }
  }
};
const normalTheme = createTheme(
  createAppTheme({
    ...baseTheme
  })
);

const adminTheme = createTheme(
  createAppTheme({
    ...baseTheme,
    colorPrimary: "#C395EE",
    colorHeader: "#CBA0FA",
    colorControl: "#DBACFA"
  })
);

const ArwesProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(
    window.location.pathname.indexOf("/director") === 0
  );
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Electrolize|Titillium+Web"
        rel="stylesheet"
      />

      <ThemeProvider theme={isAdmin ? adminTheme : normalTheme}>
        <SoundsProvider sounds={createSounds(sounds)}>
          <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
            <Layout isAdmin={isAdmin}>{children}</Layout>
          </AdminContext.Provider>
        </SoundsProvider>
      </ThemeProvider>
    </>
  );
};

ArwesProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ArwesProvider;
