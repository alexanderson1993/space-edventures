import React from "react";
import { render as rtlRender } from "react-testing-library";
import { ThemeProvider, createTheme } from "@arwes/arwes";
import { SoundsProvider, createSounds } from "@arwes/sounds";
import createAppTheme from "./createAppTheme";
import { AdminContext } from "../layout/arwesProvider";
import AuthContext from "./authContext/index";

const normalTheme = createTheme(
  createAppTheme({
    typography: {
      headerSizes: {
        h1: 44
      }
    }
  })
);

const ArwesProvider = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        completeMagicLinkSignin: () => Promise.resolve()
      }}
    >
      <SoundsProvider sounds={createSounds({})}>
        <ThemeProvider theme={normalTheme}>
          <AdminContext.Provider value={{ isAdmin: false }}>
            {children}
          </AdminContext.Provider>
        </ThemeProvider>
      </SoundsProvider>
    </AuthContext.Provider>
  );
};

export function render(ui) {
  return rtlRender(<ArwesProvider>{ui}</ArwesProvider>);
}
