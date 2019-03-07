import React from "react";
import { Query } from "react-apollo";
import { Button, Link } from "../../../components";
import graphQLHelper from "../../../helpers/graphQLHelper";
import GET_RANKS from "./getRanks.graphql";
const Rank = () => {
  return (
    <div>
      <h1>Ranks</h1>
      <Link to="/admin/rank/create">
        <Button>Create Rank</Button>
      </Link>
      <Query query={GET_RANKS}>
        {graphQLHelper(({ ranks }) =>
          ranks.length === 0 ? (
            "No ranks."
          ) : (
            <ul>
              {ranks
                .concat()
                .sort((a, b) => {
                  if (a.flightHours > b.flightHours) return 1;
                  if (a.flightHours < b.flightHours) return -1;
                  return 0;
                })
                .map(r => (
                  <li key={r.id}>
                    <Link to={`/admin/rank/${r.id}`}>{r.name}</Link>
                  </li>
                ))}
            </ul>
          )
        )}
      </Query>
    </div>
  );
};

export default Rank;
