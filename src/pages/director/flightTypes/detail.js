import React from "react";
import FLIGHT_TYPES_QUERY from "./flightTypes.graphql";
import { Query } from "react-apollo";
import graphQLHelper from "../../../helpers/graphQLHelper";

const SimulatorDetail = ({ flightTypeId }) => {
  return (
    <Query query={FLIGHT_TYPES_QUERY}>
      {graphQLHelper(({ flightTypes }) => {
        const flightType = flightTypes.find(f => f.id === flightTypeId);
        if (!flightType) return "Unable to find flight type.";
        return (
          <div>
            <h1>Flight Type: {flightType.name}</h1>
            <p>Flight Hours: {flightType.flightHours}</p>
            <p>Class Hours: {flightType.classHours}</p>
          </div>
        );
      })}
    </Query>
  );
};

export default SimulatorDetail;
