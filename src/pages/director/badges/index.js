import React from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import BADGES_QUERY from "./badges.graphql";
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
const BadgeIndex = props => {
  return (
    <div>
      <ButtonAlign>
        <h1>Badges</h1>
        <Link to="/director/badges/create">
          <Button>Create Badge</Button>
        </Link>
      </ButtonAlign>
      <ul>
        <Query query={BADGES_QUERY}>
          {graphQLHelper(({ badges }) =>
            badges && badges.length ? (
              badges.map(s => (
                <li key={s.id}>
                  <Link to={`/director/badges/${s.id}`}>{s.name}</Link>
                </li>
              ))
            ) : (
              <p>No Badges.</p>
            )
          )}
        </Query>
      </ul>
    </div>
  );
};

export default BadgeIndex;
