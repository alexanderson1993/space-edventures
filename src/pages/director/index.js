import React, { lazy } from "react";
import { Router } from "@reach/router";
import { ThemeProvider, createTheme } from "@arwes/arwes";
import createAppTheme from "../../helpers/createAppTheme";

const Splash = lazy(() => import("./splash"));
const SignUp = lazy(() => import("./signUp"));
const SignIn = lazy(() => import("./signIn"));
const Details = lazy(() => import("./details"));
const Register = lazy(() => import("./register"));
const Dashboard = lazy(() => import("./dashboard"));

const adminTheme = createAppTheme({
  colorPrimary: "#C395EE",
  colorHeader: "#CBA0FA",
  colorControl: "#DBACFA"
});

export default () => {
  return (
    <ThemeProvider theme={createTheme(adminTheme)}>
      <Router>
        <Splash path="/" />
        <SignUp path="signUp" />
        <SignIn path="signIn" />
        <Details path="details" />
        <Register path="register" />
        <Dashboard path="dashboard" />
      </Router>
    </ThemeProvider>
  );
};
