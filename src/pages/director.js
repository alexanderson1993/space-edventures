import React, { lazy, useContext } from "react";
import { Router } from "@reach/router";
import { Query } from "react-apollo";
import CENTER_DIRECTOR from "../routes/director/centerDirector.graphql";
import AuthContext from "../helpers/authContext";
import graphqlHelper from "../helpers/graphQLHelper";
import { DirectorContext } from "../helpers/directorContext";

const Dashboard = lazy(() => import("../routes/director/dashboard"));
const Splash = lazy(() => import("../routes/director/splash"));
const Register = lazy(() => import("../routes/director/register"));
const Navigation = lazy(() => import("../routes/director/navigation"));

// Management Pages
const SimulatorIndex = lazy(() => import("../routes/director/simulators"));
const SimulatorEdit = lazy(() => import("../routes/director/simulators/edit"));
const SimulatorDetail = lazy(() =>
  import("../routes/director/simulators/detail")
);

const BadgeIndex = lazy(() => import("../routes/director/badges"));
const BadgeEdit = lazy(() => import("../routes/director/badges/edit"));
const BadgeDetail = lazy(() => import("../routes/director/badges/detail"));

const MissionIndex = lazy(() => import("../routes/director/missions"));
const MissionEdit = lazy(() => import("../routes/director/missions/edit"));
const MissionDetail = lazy(() => import("../routes/director/missions/detail"));

const FlightTypeIndex = lazy(() => import("../routes/director/flightTypes"));
const FlightTypeEdit = lazy(() =>
  import("../routes/director/flightTypes/edit")
);
const FlightTypeDetail = lazy(() =>
  import("../routes/director/flightTypes/detail")
);

const Flights = lazy(() => import("../routes/director/flights"));
const FlightDetail = lazy(() => import("../routes/director/flights/detail"));
const FlightPrint = lazy(() => import("../routes/director/flights/print"));

const Settings = lazy(() => import("../routes/director/settings"));
const Billing = lazy(() => import("../routes/director/billing"));

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
  return user ? (
    center ? (
      <Navigation>
        <DirectorContext.Provider value={{ director }}>
          <Router>
            <Dashboard path="/director" />

            <SimulatorIndex path="/director/simulators" />
            <SimulatorDetail path="/director/simulators/:simulatorId" />
            <SimulatorEdit path="/director/simulators/create" create />
            <SimulatorEdit path="/director/simulators/edit/:simulatorId" />

            <BadgeIndex path="/director/badges" />
            <BadgeDetail path="/director/badges/:badgeId" />
            <BadgeEdit path="/director/badges/create" create />
            <BadgeEdit path="/director/badges/edit/:badgeId" />

            <MissionIndex path="/director/missions" />
            <MissionDetail path="/director/missions/:missionId" />
            <MissionEdit path="/director/missions/create" create />
            <MissionEdit path="/director/missions/edit/:missionId" />

            <FlightTypeIndex path="/director/flightTypes" />
            <FlightTypeDetail path="/director/flightTypes/:flightTypeId" />
            <FlightTypeEdit path="/director/flightTypes/create" create />
            <FlightTypeEdit path="/director/flightTypes/edit/:flightTypeId" />

            <Flights path="/director/flights" />
            <FlightDetail path="/director/flights/:id" />
            <FlightPrint path="/director/flights/:id/print" />
            <Settings path="/director/settings" />
            <Billing path="/director/billing" />
          </Router>
        </DirectorContext.Provider>
      </Navigation>
    ) : (
      <Register />
    )
  ) : (
    <Splash />
  );
};

export default RouteData;
