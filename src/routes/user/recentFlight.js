import React from "react";
import RECENT_FLIGHT from "./recentFlight.graphql";
import graphQLHelper from "../../helpers/graphQLHelper";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { Button } from "../../components";

const GridContainer = styled("div")`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;
const GridItem = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1em;
  p {
    margin-bottom: 0.5em;
  }
  h4 {
    margin: 0;
  }
`;
const RecentFlight = () => {
  return (
    <Query query={RECENT_FLIGHT}>
      {graphQLHelper(({ flightUser: { flights: [flight] } }) =>
        flight ? (
          <GridContainer>
            <GridItem>
              <p>Date</p>
              <h3>{new Date(flight.date).toDateString()}</h3>
            </GridItem>
            <GridItem>
              <p>Flight Type</p>
              <h3>{flight.flightRecord.flightType.name}</h3>
            </GridItem>
            <GridItem>
              <p>Hours</p>
              <h4>Flight: {flight.flightRecord.flightType.flightHours}</h4>
              <h4>Class: {flight.flightRecord.flightType.classHours}</h4>
            </GridItem>
            <GridItem>
              <p>Simulator</p>
              <h3>{flight.simulator.name}</h3>
            </GridItem>
            <GridItem>
              <p>Station</p>
              <h3>{flight.stationName}</h3>
            </GridItem>

            {flight.badges.find(b => b.type === "mission") && (
              <GridItem>
                <p>Mission</p>
                <h3>{flight.badges.find(b => b.type === "mission").name}</h3>
              </GridItem>
            )}
          </GridContainer>
        ) : (
          <div
            css={css`
              display: flex;
              align-items: center;
              flex-direction: column;
            `}
          >
            <h1>No Recent Flight</h1>
            <Button>Redeem a Flight</Button>
          </div>
        )
      )}
    </Query>
  );
};

export default RecentFlight;
