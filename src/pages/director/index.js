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
const Register = lazy(() => import("./register"));
const Dashboard = lazy(() => import("./dashboard"));
const Navigation = lazy(() => import("./navigation"));

// Management Pages
const SimulatorEdit = lazy(() => import("./simulators/edit"));
const SimulatorDetail = lazy(() => import("./simulators/detail"));

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
  let { center } = director;
  if (process.env.NODE_ENV !== "production") center = {};
  return user ? (
    center ? (
      <Navigation>
        <Router>
          <Welcome path="/" />
          <Dashboard path="dashboard" />
          <SimulatorDetail path="simulators/:simulatorId" />
          <SimulatorEdit path="simulators/create" create />
          <SimulatorEdit path="simulators/edit/:simulatorId" />
        </Router>
      </Navigation>
    ) : (
      <Register />
    )
  ) : (
    <Splash />
  );
};

export default RouteData;
