import React, { useContext } from "react";
import RECENT_FLIGHT from "./recentFlight.graphql";
import graphQLHelper from "../../helpers/graphQLHelper";
import { Query } from "react-apollo";
import styled from "@emotion/styled";
import css from "@emotion/css";
import { Button, Link } from "../../components";
import AuthContext from "../../helpers/authContext";

const GridContainer = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media only screen and (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
  gap: 1.2em;
  justify-content: center;
  align-items: center;
  justify-items: center;
  text-align: center;
`;
const GridItem = styled("div")`
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
  const { user } = useContext(AuthContext);
  return (
    <Query query={RECENT_FLIGHT} variables={{ id: user.id }}>
      {graphQLHelper(({ flightUser: { flights: [flight] } }) =>
        flight ? (
          <>
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

              {flight.badges
                .filter(Boolean)
                .find(b => b.type === "mission") && (
                <GridItem>
                  <p>Mission</p>
                  <h3>
                    {
                      flight.badges
                        .filter(Boolean)
                        .find(b => b.type === "mission").name
                    }
                  </h3>
                </GridItem>
              )}
            </GridContainer>
            <Link to="/redeem">
              <Button block>Redeem a Flight</Button>
            </Link>
          </>
        ) : (
          <div
            css={css`
              display: flex;
              align-items: center;
              flex-direction: column;
            `}
          >
            <h1>No Recent Flight</h1>
            <Link to="/redeem">
              <Button>Redeem a Flight</Button>
            </Link>
          </div>
        )
      )}
    </Query>
  );
};

export default RecentFlight;
