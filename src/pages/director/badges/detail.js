import React from "react";

const BadgeDetail = ({ name, description, badgeId }) => {
  return (
    <div>
      <h1>Badge: {name}</h1>
      <h2>Description</h2>
      <p>{description}</p>
      <p>
        Use the following ID when setting up this simulator with Thorium or
        providing flight information through the API:
      </p>
      <pre>{badgeId}</pre>
    </div>
  );
};

export default BadgeDetail;
