import React from "react";

export default ({ children, style }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      ...style
    }}
  >
    {children}
  </div>
);
