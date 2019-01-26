import React from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import FLIGHT_TYPES_QUERY from "../../../queries/flightTypes.graphql";
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
const FlightTypesIndex = props => {
  return (
    <div>
      <ButtonAlign>
        <h1>Flight Types</h1>
        <Link to="/director/flightTypes/create">
          <Button>Create Flight Type</Button>
        </Link>
      </ButtonAlign>
      <ul>
        <Query query={FLIGHT_TYPES_QUERY}>
          {graphQLHelper(({ flightTypes }) =>
            flightTypes && flightTypes.length ? (
              flightTypes.map(s => (
                <li key={s.id}>
                  <Link to={`/director/flightTypes/${s.id}`}>{s.name}</Link>
                </li>
              ))
            ) : (
              <p>No Flight Types.</p>
            )
          )}
        </Query>
      </ul>
    </div>
  );
};

export default FlightTypesIndex;
