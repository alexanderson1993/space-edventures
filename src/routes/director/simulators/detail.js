import React from "react";
import { Button, Link } from "../../../components";
import { Query } from "react-apollo";
import graphQLHelper from "../../../helpers/graphQLHelper";
import SIMULATORS_QUERY from "./simulators.graphql";

const SimulatorDetail = ({ simulatorId }) => {
  return (
    <Query query={SIMULATORS_QUERY}>
      {graphQLHelper(({ simulators }) => {
        const simulator = simulators.find(s => s.id === simulatorId);
        if (!simulator) return <h1>No simulator found.</h1>;
        return (
          <div>
            <h1>Simulator: {simulator.name}</h1>

            <div>
              <Link to={`/director/simulators/edit/${simulatorId}`}>
                <Button>Rename Simulator</Button>
              </Link>
            </div>
          </div>
        );
      })}
    </Query>
  );
};

export default SimulatorDetail;
