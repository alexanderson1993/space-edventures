import React from "react";

const UserContext = React.createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

export default UserContext;
