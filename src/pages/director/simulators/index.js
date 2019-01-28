import React from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import SIMULATORS_QUERY from "../../../queries/simulators.graphql";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Link, Button } from "../../../components";
const ButtonAlign = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  h1 {
    margin-right: 20px;
    margin-bottom: 0;
  }
`;
const SimulatorIndex = props => {
  return (
    <div>
      <ButtonAlign>
        <h1>Simulators</h1>
        <Link to="/director/simulators/create">
          <Button>Create Simulator</Button>
        </Link>
      </ButtonAlign>
      <ul>
        <Query query={SIMULATORS_QUERY}>
          {graphQLHelper(({ simulators }) =>
            simulators && simulators.length ? (
              simulators.map(s => (
                <li key={s.id}>
                  <Link to={`/director/simulators/${s.id}`}>{s.name}</Link>
                </li>
              ))
            ) : (
              <p>No Simulators.</p>
            )
          )}
        </Query>
      </ul>
    </div>
  );
};

export default SimulatorIndex;
