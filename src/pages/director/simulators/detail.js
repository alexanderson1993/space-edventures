import React from "react";
import { Input, Button, Link } from "../../../components";
import css from "@emotion/css";
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
            <p>
              Use the following ID when setting up this simulator with Thorium
              or providing flight information through the API:
            </p>
            <Input
              readOnly
              css={css`
                width: ${simulatorId.length + 2}ch;
              `}
              value={simulatorId}
            />
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
