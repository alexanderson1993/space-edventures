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

function reducer({ skip }, { type, flightRecords }) {
  const newSkip = type === "next" ? skip + 10 : Math.max(0, skip - 10);
  const newStartAfter =
    newSkip - 1 < 0
      ? null
      : flightRecords[newSkip - 1] || flightRecords[flightRecords.length - 1];
  return { skip: newSkip, startAfter: newStartAfter && newStartAfter.id };
}
const Paginator = ({ dispatch, skip, flightRecords, flightRecordCount }) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-around;
      `}
    >
      <Button rel="prev" onClick={() => dispatch("prev")} disabled={skip === 0}>
        Previous
      </Button>
      <Button
        rel="next"
        onClick={() => dispatch({ type: "next", flightRecords })}
        disabled={skip + 10 >= flightRecordCount}
      >
        Next
      </Button>
    </div>
  );
};

const Flights = () => {
  const [{ skip, startAfter }, dispatch] = useReducer(reducer, {
    skip: 0,
    startAfter: null
  });
  const { user } = useContext(AuthContext);
  return (
    <Query query={GET_FLIGHTS} variables={{ id: user && user.id, startAfter }}>
      {graphQLHelper(({ me = {} }) => {
        const { flights = [], flightCount = 0 } = me;
        return (
          <Content>
            <h1>My Flights</h1>
            <Paginator
              dispatch={dispatch}
              skip={skip}
              flightRecords={flights}
              flightRecordCount={flightCount}
            />
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

            <Paginator
              dispatch={dispatch}
              skip={skip}
              flightRecords={flights}
              flightRecordCount={flightCount}
            />
          </Content>
        );
      })}
    </Query>
  );
};

export default Flights;
