import React, { useContext, useCallback } from "react";
import ProfileContext from "./";
import propTypes from "prop-types";
import { Query } from "react-apollo";
import ME_QUERY from "../../queries/me.graphql";
import AuthContext from "../authContext";

const ProfileProvider = ({ children }) => {
  const { loading, user } = useContext(AuthContext);
  const result = useCallback(
    ({ data, loading: queryLoading }) => (
      <ProfileContext.Provider
        value={{
          user: {
            ...(data ? data.me : {}),
            profile: data && data.me ? data.me.profile : {},
            loading: data ? false : loading || queryLoading
          }
        }}
      >
        {children}
      </ProfileContext.Provider>
    ),
    [children, loading]
  );

  return (
    <Query query={ME_QUERY} skip={!user} variables={{ user: user && user.id }}>
      {result}
    </Query>
  );
};

ProfileProvider.propTypes = {
  children: propTypes.node
};
export default ProfileProvider;
