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
  const rankSrc = `/images/ranks/${
    user.profile.rank ? user.profile.rank.name : "Cadet"
  }.svg`;
  return (
    <Query query={RANKS}>
      {graphQLHelper(({ ranks }) => {
        const nextRank =
          ranks
            .sort((a, b) => {
              if (a.flightHours + a.classHours > b.flightHours + b.classHours)
                return 1;
              if (a.flightHours + a.classHours < b.flightHours + b.classHours)
                return -1;
              return 0;
            })
            .filter(
              r =>
                r.flightHours > user.profile.flightHours ||
                r.classHours > user.profile.classHours
            )[0] || {};
        const needsFlightHours =
          nextRank.flightHours - user.profile.flightHours > 0;
        const needsClassHours =
          nextRank.classHours - user.profile.classHours > 0;
        return (
          <>
            <img
              src={rankSrc}
              alt={user.profile.rank ? user.profile.rank.name : "Cadet"}
              css={css`
                max-height: 150px;
              `}
            />
            <h1
              css={css`
                text-align: center;
              `}
            >
              <Link to={`/ranks#${user.profile.rank.name}`}>
                {user.profile.rank.name}
              </Link>
            </h1>
            {nextRank.flightHours ? (
              <p>
                To reach the next rank of{" "}
                <Link to={`/ranks#${nextRank.name}`}>{nextRank.name}</Link>, you
                need{" "}
                {needsFlightHours
                  ? `${nextRank.flightHours -
                      user.profile.flightHours} more flight
              hours`
                  : ""}
                {needsFlightHours && needsClassHours ? " and" : ""}
                {needsClassHours
                  ? ` ${nextRank.classHours - user.profile.classHours} more
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
