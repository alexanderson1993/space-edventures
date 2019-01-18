import React from "react";

const AuthContext = React.createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

export default AuthContext;
