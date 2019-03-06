import React, { useContext } from "react";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Query } from "react-apollo";
import GET_FLIGHT from "./getFlight.graphql";
import { DirectorContext } from "../../../helpers/directorContext";
import css from "@emotion/css";

const Flights = ({ id }) => {
  const {
    director: { center = {} }
  } = useContext(DirectorContext);
  return (
    <div>
      <h1>Flight</h1>
      <Query query={GET_FLIGHT} variables={{ id, centerId: center.id }}>
        {graphQLHelper(({ flightRecord }) => (
          <div>
            <h2>
              <small>Date:</small> {new Date(flightRecord.date).toDateString()}
            </h2>
            <h2>
              <small>Flight Type:</small> {flightRecord.flightType.name}
            </h2>
            <h2>Simulators:</h2>
            {flightRecord.simulators.map(s => {
              const mission = s.stations.reduce(
                (prev, next) =>
                  prev || next.badges.find(b => b.type === "mission"),
                null
              );
              const badges = s.stations
                .reduce(
                  (prev, next) =>
                    prev.concat(
                      next.badges.map(b => ({
                        ...b,
                        station: next.name,
                        userId: next.userId
                      }))
                    ),
                  []
                )
                .filter(b => b.type === "badge");
              return (
                <div
                  key={s.id}
                  css={css`
                    margin-left: 40px;
                  `}
                >
                  <h3
                    css={css`
                      margin-left: -20px !important;
                    `}
                  >
                    {s.name}
                  </h3>
                  {mission && <h4>Mission: {mission.name}</h4>}
                  <div
                    css={css`
                      display: flex;
                    `}
                  >
                    <div
                      css={css`
                        flex: 1;
                      `}
                    >
                      <h4>Stations:</h4>
                      {s.stations.map((t, i) => (
                        <div key={`${t}-${i}`}>{`${t.name}${
                          t.userId ? "" : " (Unclaimed)"
                        }`}</div>
                      ))}
                    </div>
                    {badges.length > 0 && (
                      <div
                        css={css`
                          flex: 1;
                        `}
                      >
                        <h4>Badges</h4>
                        {badges.map(b => (
                          <div key={`${b.id}-${b.station}`}>
                            {b.station}: {b.name}
                            {`${b.userId ? "" : " (Unclaimed)"}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </Query>
    </div>
  );
};

export default Flights;
