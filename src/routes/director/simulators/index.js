import React, { useContext } from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import SIMULATORS_QUERY from "./simulators.graphql";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Link, Button } from "../../../components";
import { CenterContext } from "../../../pages/director";
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
  const center = useContext(CenterContext);
  return (
    <div>
      <ButtonAlign>
        <h1>Simulators</h1>
        <Link to={`/director/${center.id}/simulators/create`}>
          <Button>Create Simulator</Button>
        </Link>
      </ButtonAlign>
      <ul>
        <Query query={SIMULATORS_QUERY} variables={{ centerId: center.id }}>
          {graphQLHelper(({ simulators }) =>
            simulators && simulators.length ? (
              simulators.map(s => (
                <li key={s.id}>
                  <Link to={`/director/${center.id}/simulators/${s.id}`}>
                    {s.name}
                  </Link>
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
