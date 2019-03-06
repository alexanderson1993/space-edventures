import React, { useContext } from "react";

export default () => {
  const { director } = { useContext };
  console.log(director);
  return (
    <div>
      <h1>Billing</h1>
    </div>
  );
};
