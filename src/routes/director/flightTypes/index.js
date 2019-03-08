import React, { useContext } from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import FLIGHT_TYPES_QUERY from "./flightTypes.graphql";
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
const FlightTypesIndex = props => {
  const center = useContext(CenterContext);
  return (
    <div>
      <ButtonAlign>
        <h1>Flight Types</h1>
        <Link to={`/director/${center.id}/flightTypes/create`}>
          <Button>Create Flight Type</Button>
        </Link>
      </ButtonAlign>
      <ul>
        <Query query={FLIGHT_TYPES_QUERY} variables={{ centerId: center.id }}>
          {graphQLHelper(({ flightTypes }) =>
            flightTypes && flightTypes.length ? (
              flightTypes.map(s => (
                <li key={s.id}>
                  <Link to={`/director/${center.id}/flightTypes/${s.id}`}>
                    {s.name}
                  </Link>
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
