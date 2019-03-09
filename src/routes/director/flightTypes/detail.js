import React, { useContext } from "react";
import FLIGHT_TYPES_QUERY from "./flightTypes.graphql";
import { Query } from "react-apollo";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Button, Link } from "../../../components";
import { CenterContext } from "../../../pages/director";

const SimulatorDetail = ({ flightTypeId }) => {
  const center = useContext(CenterContext);
  return (
    <Query query={FLIGHT_TYPES_QUERY} variables={{ centerId: center.id }}>
      {graphQLHelper(({ flightTypes }) => {
        const flightType = flightTypes.find(f => f.id === flightTypeId);
        if (!flightType) return "Unable to find flight type.";
        return (
          <div>
            <h1>Flight Type: {flightType.name}</h1>
            <p>Flight Hours: {flightType.flightHours}</p>
            <p>Class Hours: {flightType.classHours}</p>
            <Link
              to={`/director/${center.id}/flightTypes/edit/${flightTypeId}`}
            >
              <Button>Edit</Button>
            </Link>
          </div>
        );
      })}
    </Query>
  );
};

export default SimulatorDetail;
