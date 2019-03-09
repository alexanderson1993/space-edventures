import React, { useContext } from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import BADGES_QUERY from "./badges.graphql";
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
const BadgeIndex = props => {
  const center = useContext(CenterContext);
  return (
    <div>
      <ButtonAlign>
        <h1>Badges</h1>
        <Link to={`/director/${center.id}/badges/create`}>
          <Button>Create Badge</Button>
        </Link>
      </ButtonAlign>
      <ul>
        <Query query={BADGES_QUERY} variables={{ centerId: center.id }}>
          {graphQLHelper(({ badges }) =>
            badges && badges.length ? (
              badges.map(s => (
                <li key={s.id}>
                  <Link to={`/director/${center.id}/badges/${s.id}`}>
                    {s.name}
                  </Link>
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
