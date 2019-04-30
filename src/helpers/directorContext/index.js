import React, { useContext, useMemo } from "react";
import propTypes from "prop-types";
import AuthContext from "../authContext";
import { Query } from "react-apollo";
import graphQLHelper from "../graphQLHelper";
import CENTER_DIRECTOR from "./centerDirector.graphql";
import { Match } from "@reach/router";
export const DirectorContext = React.createContext({});

const Provider = ({ me = {}, children }) => {
  const value = useMemo(() => me, [me]);
  return (
    <DirectorContext.Provider value={value}>
      {children}
    </DirectorContext.Provider>
  );
};
export const DirectorProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <Match path="/director/:centerId/*">
      {({ match }) => (
        <Query
          query={CENTER_DIRECTOR}
          variables={{
            centerId: match && match.centerId,
            id: user && user.id
          }}
          skip={!user || !user.id}
        >
          {graphQLHelper(({ me }) => (
            <Provider me={me} children={children} />
          ))}
        </Query>
      )}
    </Match>
  );
};

DirectorProvider.propTypes = {
  children: propTypes.node
};
