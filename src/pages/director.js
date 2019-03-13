import React, { useContext } from "react";
import { Router } from "@reach/router";
import AuthContext from "../helpers/authContext";
import { DirectorProvider, DirectorContext } from "../helpers/directorContext";
import lazy from "../helpers/lazy";

const Dashboard = lazy(() => import("../routes/director/dashboard"));
const Splash = lazy(() => import("../routes/director/splash"));
const Register = lazy(() => import("../routes/director/register"));
const Navigation = lazy(() => import("../routes/director/navigation"));

const ChooseCenter = lazy(() => import("../routes/director/chooseCenter"));
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
const Staff = lazy(() => import("../routes/director/staff"));

const RankChecker = lazy(() => import("../routes/director/rankChecker"));

export const CenterContext = React.createContext();

const Routes = ({ centerId }) => {
  const director = useContext(DirectorContext);
  const center = director.centers.find(c => c.id === centerId);
  if (!center) return <ChooseCenter />;
  return (
    <CenterContext.Provider value={center}>
      <Navigation>
        <Router>
          <Dashboard path="*" />

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

          <Flights path="flights" />
          <FlightDetail path="flights/:id" />
          <FlightPrint path="flights/:id/print" />
          <Settings path="settings" />
          <Billing path="billing" />
          <Staff path="staff" />

          <RankChecker path="rankCheck" />
        </Router>
      </Navigation>
    </CenterContext.Provider>
  );
};

const DirectorPage = () => {
  const { user } = useContext(AuthContext);
  return user ? (
    <DirectorProvider>
      <Router>
        <ChooseCenter path="/director" />
        <Register path="/director/register" />
        <Routes path="/director/:centerId/*" />
      </Router>
    </DirectorProvider>
  ) : (
    <Splash />
  );
};

export default DirectorPage;
