import React, { useState, useContext } from "react";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import BADGES_QUERY from "./badges.graphql";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Link, Button, Input } from "../../../components";
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
  const [filter, setFilter] = useState(null);
  return (
    <div>
      <ButtonAlign>
        <h1>Badges</h1>
        <Link to={`/director/${center.id}/badges/create`}>
          <Button>Create Badge</Button>
        </Link>
        <Input
          type="text"
          placeholder="Search"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </ButtonAlign>
      <ul>
        <Query query={BADGES_QUERY} variables={{ centerId: center.id }}>
          {graphQLHelper(({ badges }) => {
            if (!badges || badges.length) return "No Badges";
            if (filter) {
              return badges
                .filter(m => new RegExp(filter, "gi").test(m.name))
                .map(s => (
                  <li key={s.id}>
                    <Link to={`/director/${center.id}/badges/${s.id}`}>
                      {s.name}
                    </Link>
                  </li>
                ));
            }
            return badges.map(s => (
              <li key={s.id}>
                <Link to={`/director/${center.id}/badges/${s.id}`}>
                  {s.name}
                </Link>
              </li>
            ));
          })}
        </Query>
      </ul>
    </div>
  );
};

export default BadgeIndex;
