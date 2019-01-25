import React, { lazy, useContext } from "react";
import { Router } from "@reach/router";
import { ThemeProvider, createTheme } from "@arwes/arwes";
import createAppTheme from "../../helpers/createAppTheme";
import { Query } from "react-apollo";
import CENTER_DIRECTOR from "../../queries/centerDirector.graphql";
import AuthContext from "../../helpers/authContext";
import graphqlHelper from "../../helpers/graphQLHelper";

const Welcome = lazy(() => import("./welcome"));
const Splash = lazy(() => import("./splash"));
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

const RouteData = () => {
  const { user } = useContext(AuthContext);
  return (
    <Query query={CENTER_DIRECTOR} skip={!user}>
      {graphqlHelper(({ me }) => (
        <Routes director={me} />
      ))}
    </Query>
  );
};

const Routes = ({ director = {} }) => {
  const { user } = useContext(AuthContext);
  let { center = {} } = director;
  if (process.env.NODE_ENV !== "production") center = {};
  return (
    <ThemeProvider theme={createTheme(adminTheme)}>
      <Router>
        {user ? (
          center ? (
            <>
              <Welcome path="/" />
              <Dashboard path="dashboard" />
              {/* Management Pages */}
              <SimulatorDetail path="simulators/:simulatorId" />
              <SimulatorEdit path="simulators/create" create />
              <SimulatorEdit path="simulators/edit/:simulatorId" />
            </>
          ) : (
            <Register path="/" />
          )
        ) : (
          <Splash path="/" />
        )}
        <SignIn path="signIn" />
        <Details path="details" />
      </Router>
    </ThemeProvider>
  );
};

export default RouteData;
