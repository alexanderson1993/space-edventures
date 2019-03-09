import React, { useContext } from "react";
import { Table, Link, Button } from "../../../components";
import graphQLHelper from "../../../helpers/graphQLHelper";
import { Query } from "react-apollo";
import GET_FLIGHTS from "./getFlights.graphql";
import { CenterContext } from "../../../pages/director";

const Flights = () => {
  const center = useContext(CenterContext);
  return (
    <div>
      <h1>Flights</h1>
      <Query query={GET_FLIGHTS} variables={{ centerId: center.id }}>
        {graphQLHelper(({ flightRecords }) => (
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
                      <Link to={`/director/${center.id}/flights/${r.id}/print`}>
                        <Button>Print Ranks</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        ))}
      </Query>
    </div>
  );
};

export default Flights;
