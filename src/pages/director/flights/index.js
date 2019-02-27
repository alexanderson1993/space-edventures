import React from "react";
import { Table } from "../../../components";

const Flights = () => {
  return (
    <div>
      <h1>Flights</h1>
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Flight Type</th>
            <th>Simulator</th>
            <th>Stations</th>
          </tr>
        </thead>
      </Table>
    </div>
  );
};

export default Flights;
