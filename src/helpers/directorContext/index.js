import React, { useContext } from "react";
import propTypes from "prop-types";
import AuthContext from "../authContext";
import { Query } from "react-apollo";
import graphQLHelper from "../graphQLHelper";
import CENTER_DIRECTOR from "./centerDirector.graphql";

export const DirectorContext = React.createContext({});

export const DirectorProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <Query query={CENTER_DIRECTOR} skip={!user}>
      {graphQLHelper(({ me }) => (
        <DirectorContext.Provider value={me || {}}>
          {children}
        </DirectorContext.Provider>
      ))}
    </Query>
  );
};

DirectorProvider.propTypes = {
  children: propTypes.node
};
