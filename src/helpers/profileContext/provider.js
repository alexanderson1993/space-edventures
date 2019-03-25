import React, { useContext } from "react";
import ProfileContext from "./";
import propTypes from "prop-types";
import ME_QUERY from "../../queries/me.graphql";
import AuthContext from "../authContext";
import { useQuery } from "react-apollo-hooks";

const ProfileProvider = ({ children }) => {
  const { loading: authLoading, user } = useContext(AuthContext);
  const { data = {}, loading } = useQuery(ME_QUERY, {
    variables: { id: user && user.id },
    skip: !user || !user.id
  });
  const { me } = data;
  return (
    <ProfileContext.Provider
      value={{
        user: {
          ...me,
          profile: me ? me.profile : {},
          loading: loading || authLoading
        }
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: propTypes.node
};
export default ProfileProvider;
