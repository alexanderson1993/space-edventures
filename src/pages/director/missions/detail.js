import React from "react";

const MissionDetail = ({ name, missionId }) => {
  return (
    <div>
      <h1>Mission: {name}</h1>
      <p>
        Use the following ID when setting up this mission with Thorium or
        providing flight information through the API:
      </p>
      <pre>{missionId}</pre>
    </div>
  );
};

export default MissionDetail;
