import React, { useContext, useReducer } from "react";
import { Table, Link, Button } from "../../../components";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Query } from "react-apollo";
import GET_FLIGHTS from "./getFlights.graphql";
import { CenterContext } from "../../../pages/director";
import css from "@emotion/css";

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
        disabled={skip + 10 > flightRecordCount}
      >
        Next
      </Button>
    </div>
  );
};

function hasUnclaimed(simulators) {
  return simulators.reduce((acc, sim) => {
    if (acc) return acc;
    return sim.stations.find(s => !s.userId);
  }, false);
}

const Flights = () => {
  const [{ skip, startAfter }, dispatch] = useReducer(reducer, {
    skip: 0,
    startAfter: null
  });
  const center = useContext(CenterContext);
  return (
    <div>
      <h1>Flights</h1>

      <Query
        query={GET_FLIGHTS}
        variables={{ centerId: center.id, skip, startAfter }}
      >
        {graphQLHelper(({ flightRecords, flightRecordCount }) => (
          <>
            <Paginator
              dispatch={dispatch}
              skip={skip}
              flightRecords={flightRecords}
              flightRecordCount={flightRecordCount}
            />
            <Table>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Flight Type</th>
                    <th>Simulator</th>
                    <th>Stations</th>
                    <th>Print</th>
                  </tr>
                </thead>
                <tbody>
                  {flightRecords.map(r => (
                    <tr>
                      <Link
                        key={r.id}
                        to={`/director/${center.id}/flights/${r.id}`}
                      >
                        <td>{new Date(r.date).toDateString()}</td>
                      </Link>
                      <td>{r.flightType.name}</td>
                      <td>{r.simulators.map(s => s.name).join(",")}</td>
                      <td>
                        {r.simulators.map(s => s.stations.length).join(",")}
                      </td>
                      <td>
                        {hasUnclaimed(r.simulators) && (
                          <Link
                            to={`/director/${center.id}/flights/${r.id}/print`}
                          >
                            <Button>Print Ranks</Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Table>
            <Paginator
              dispatch={dispatch}
              skip={skip}
              flightRecords={flightRecords}
              flightRecordCount={flightRecordCount}
            />
          </>
        ))}
      </Query>
    </div>
  );
};

export default Flights;
