import React, { useContext } from "react";
import RANKS from "./ranks.graphql";
import graphQLHelper from "../../helpers/graphQLHelper";
import { Query } from "react-apollo";
import css from "@emotion/css";
import { Link } from "../../components";
import ProfileContext from "../../helpers/profileContext";

const Rank = () => {
  const { user } = useContext(ProfileContext);
  if (!user.profile.rank) return null;
  return (
    <Query query={RANKS}>
      {graphQLHelper(({ ranks }) => {
        const nextRank = ranks
          .sort((a, b) => {
            if (a.flightHours + a.classHours > b.flightHours + b.classHours)
              return 1;
            if (a.flightHours + a.classHours < b.flightHours + b.classHours)
              return -1;
            return 0;
          })
          .filter(
            r =>
              r.flightHours > user.profile.flightHours &&
              r.classHours > user.profile.classHours
          )[0];
        return (
          <>
            <h1
              css={css`
                text-align: center;
              `}
            >
              <Link to={`/ranks#${user.profile.rank.name}`}>
                {user.profile.rank.name}
              </Link>
            </h1>
            {nextRank ? (
              <p>
                To reach the next rank of{" "}
                <Link to={`/ranks#${nextRank.name}`}>{nextRank.name}</Link>, you
                need{" "}
                {nextRank.flightHours - user.profile.flightHours > 0
                  ? `${nextRank.flightHours -
                      user.profile.flightHours} more flight
              hours`
                  : ""}
                {nextRank.classHours - user.profile.classHours > 0
                  ? ` and ${nextRank.classHours - user.profile.classHours} more
              class hours`
                  : ""}
                .
              </p>
            ) : (
              <p>You have reached the highest rank. Congratulations!</p>
            )}
          </>
        );
      })}
    </Query>
  );
};

export default Rank;
