import React, { useContext } from "react";
import propTypes from "prop-types";
import AuthContext from "../authContext";
import { Query } from "react-apollo";
import graphQLHelper from "../graphQLHelper";
import CENTER_DIRECTOR from "./centerDirector.graphql";
import { Match } from "@reach/router";
export const DirectorContext = React.createContext({});

export const DirectorProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <Match path="/director/:centerId/*">
      {({ match }) => (
        <Query
          query={CENTER_DIRECTOR}
          variables={{ centerId: match && match.centerId }}
          skip={!user}
        >
          {graphQLHelper(({ me }) => (
            <DirectorContext.Provider value={me || {}}>
              {children}
            </DirectorContext.Provider>
          ))}
        </Query>
      )}
    </Match>
  );
};

DirectorProvider.propTypes = {
  children: propTypes.node
};
