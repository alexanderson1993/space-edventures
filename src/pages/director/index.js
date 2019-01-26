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
const SimulatorIndex = lazy(() => import("./simulators"));
const SimulatorEdit = lazy(() => import("./simulators/edit"));
const SimulatorDetail = lazy(() => import("./simulators/detail"));

const BadgeIndex = lazy(() => import("./badges"));
const BadgeEdit = lazy(() => import("./badges/edit"));
const BadgeDetail = lazy(() => import("./badges/detail"));

const MissionIndex = lazy(() => import("./missions"));
const MissionEdit = lazy(() => import("./missions/edit"));
const MissionDetail = lazy(() => import("./missions/detail"));

const FlightTypeIndex = lazy(() => import("./flightTypes"));
const FlightTypeEdit = lazy(() => import("./flightTypes/edit"));
const FlightTypeDetail = lazy(() => import("./flightTypes/detail"));

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

          <SimulatorIndex path="simulators" />
          <SimulatorDetail path="simulators/:simulatorId" />
          <SimulatorEdit path="simulators/create" create />
          <SimulatorEdit path="simulators/edit/:simulatorId" />

          <BadgeIndex path="badges" />
          <BadgeDetail path="badges/:badgeId" />
          <BadgeEdit path="badges/create" create />
          <BadgeEdit path="badges/edit/:badgeId" />

          <MissionIndex path="missions" />
          <MissionDetail path="missions/:missionId" />
          <MissionEdit path="missions/create" create />
          <MissionEdit path="missions/edit/:missionId" />

          <FlightTypeIndex path="flightTypes" />
          <FlightTypeDetail path="flightTypes/:flightTypeId" />
          <FlightTypeEdit path="flightTypes/create" create />
          <FlightTypeEdit path="flightTypes/edit/:flightTypeId" />
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
