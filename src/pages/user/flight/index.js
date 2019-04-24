import React from "react";
import { Content, Words } from "../../../components";
import { Match } from "@reach/router";
import FLIGHT_RECORD from "./flightRecord.graphql";
import { useQuery } from "react-apollo-hooks";
import { Loading } from "@arwes/arwes";
import Blockquote from "@arwes/arwes/lib/Blockquote";

const FlightRecord = ({ id }) => {
  const { loading, data } = useQuery(FLIGHT_RECORD, { variables: { id } });
  const { flight } = data;
  const mission = flight && flight.badges.find(b => b.type === "mission");
  return (
    <Content>
      <h1>Flight</h1>
      {loading ? (
        <Loading />
      ) : flight ? (
        <div>
          <p>
            <strong>Date:</strong> {new Date(flight.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Center:</strong> {flight.flightRecord.center.name}
          </p>
          <p>
            <strong>Flight Type:</strong> {flight.flightRecord.flightType.name}
          </p>
          <p>
            <strong>Simulator:</strong> {flight.simulator.name}
          </p>
          <p>
            <strong>Station:</strong> {flight.stationName}
          </p>
          {mission && (
            <p>
              <strong>Mission:</strong> {mission.name}
            </p>
          )}
        </div>
      ) : (
        <Blockquote layer="alert">
          <Words>Invalid flight identification number. No flight found.</Words>
        </Blockquote>
      )}
    </Content>
  );
};
const Flight = props => {
  return (
    <Match path="/user/flight/:flightId">
      {({ match = {} }) => {
        const { flightId } = match || {};
        return <FlightRecord id={flightId} />;
      }}
    </Match>
  );
};
export default Flight;
