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

// Management Pages
const SimulatorEdit = lazy(() => import("./simulators/edit"));
const SimulatorDetail = lazy(() => import("./simulators/detail"));
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

        {/* Management Pages */}
        <SimulatorDetail path="simulators/:simulatorId" />
        <SimulatorEdit path="simulators/create" create />
        <SimulatorEdit path="simulators/edit/:simulatorId" />
      </Router>
    </ThemeProvider>
  );
};
