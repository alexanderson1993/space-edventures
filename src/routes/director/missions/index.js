import React from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import MISSIONS_QUERY from "./missions.graphql";
import { Link, Button } from "../../../components";
import Loading from "@arwes/arwes/lib/Loading";
const ButtonAlign = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  h1 {
    margin-right: 20px;
    margin-bottom: 0;
  }
`;

const MissionIndex = React.memo(props => {
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
          {({ loading, data, error }) => {
            if (loading) return <Loading animate />;
            if (error) return <div>There is an error: {error.message}</div>;
            const { missions } = data;
            return missions && missions.length ? (
              missions.map(s => (
                <li key={s.id}>
                  <Link to={`/director/missions/${s.id}`}>{s.name}</Link>
                </li>
              ))
            ) : (
              <p>No Missions.</p>
            );
          }}
        </Query>
      </ul>
    </div>
  );
});

export default MissionIndex;
