import React from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import MISSIONS_QUERY from "../../../queries/missions.graphql";
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
const MissionIndex = props => {
  return (
    <div>
      <ButtonAlign>
        <h1>Missions</h1>
        <Link to="/director/missions/create">
          <Button>Create Mission</Button>
        </Link>
      </ButtonAlign>
      <ul>
        <Query query={MISSIONS_QUERY}>
          {graphQLHelper(({ badges }) =>
            badges && badges.length ? (
              badges.map(s => (
                <li key={s.id}>
                  <Link to={`/director/missions/${s.id}`}>{s.name}</Link>
                </li>
              ))
            ) : (
              <p>No Missions.</p>
            )
          )}
        </Query>
      </ul>
    </div>
  );
};

export default MissionIndex;
