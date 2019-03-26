import React, { useReducer, useContext } from "react";
import { Content, Table, Button } from "../../../components";
import GET_FLIGHTS from "./getFlights.graphql";
import { Query } from "react-apollo";
import graphQLHelper from "../../../helpers/graphQLHelper";
import css from "@emotion/css";
import AuthContext from "../../../helpers/authContext";

const Flight = ({
  date,
  badges,
  simulator: { name: simulatorName },
  stationName,
  flightRecord: {
    center: { name: centerName },
    flightType: { name: flightTypeName }
  }
}) => {
  const mission = badges.find(b => b.type === "mission");
  return (
    <tr>
      <td>{new Date(date).toLocaleDateString()}</td>
      <td>{flightTypeName}</td>
      <td>{centerName}</td>
      <td>{simulatorName}</td>
      <td>{stationName}</td>
      <td>{mission ? mission.name : "No Mission"}</td>
    </tr>
  );
};

function reducer(state, action) {
  if (action === "next") return state + 10;
  if (action === "prev") return Math.max(0, state - 10);
}

const Flights = () => {
  const [skip, dispatch] = useReducer(reducer, 0);
  const { user } = useContext(AuthContext);
  return (
    <Query query={GET_FLIGHTS} variables={{ id: user.id, skip }}>
      {graphQLHelper(({ me = {} }) => {
        const { flights = [], flightCount = 0 } = me;
        return (
          <Content>
            <h1>My Flights</h1>
            <Table>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Flight Type</th>
                    <th>Center</th>
                    <th>Simulator</th>
                    <th>Station</th>
                    <th>Mission</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map(f => (
                    <Flight key={f.id} {...f} />
                  ))}
                </tbody>
              </table>
            </Table>

            <div
              css={css`
                display: flex;
                justify-content: space-between;
              `}
            >
              <Button
                rel="prev"
                onClick={() => dispatch("prev")}
                disabled={skip === 0}
              >
                Previous
              </Button>
              <Button
                rel="next"
                onClick={() => dispatch("next")}
                disabled={skip + 10 > flightCount}
              >
                Next
              </Button>
            </div>
          </Content>
        );
      })}
    </Query>
  );
};

export default Flights;
