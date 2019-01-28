import React from "react";

const SimulatorDetail = ({ name, simulatorId }) => {
  return (
    <div>
      <h1>Simulator: {name}</h1>
      <p>
        Use the following ID when setting up this simulator with Thorium or
        providing flight information through the API:
      </p>
      <pre>{simulatorId}</pre>
    </div>
  );
};

export default SimulatorDetail;
