import React, { useContext } from "react";
import { Button, Link } from "../../../components";
import { Query } from "react-apollo";
import graphQLHelper from "../../../helpers/graphQLHelper";
import SIMULATORS_QUERY from "./simulators.graphql";
import { CenterContext } from "../../../pages/director";

const SimulatorDetail = ({ simulatorId }) => {
  const center = useContext(CenterContext);
  return (
    <Query query={SIMULATORS_QUERY} variables={{ centerId: center.id }}>
      {graphQLHelper(({ simulators }) => {
        const simulator = simulators.find(s => s.id === simulatorId);
        if (!simulator) return <h1>No simulator found.</h1>;
        return (
          <div>
            <h1>Simulator: {simulator.name}</h1>

            <div>
              <Link
                to={`/director/${center.id}/simulators/edit/${simulatorId}`}
              >
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
