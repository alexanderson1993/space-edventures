import React, { useContext } from "react";
import PropTypes from "prop-types";
import ProfileContext from "../helpers/profileContext";
import { DirectorContext } from "../helpers/directorContext";
import { Words, Content, Button } from ".";
import { Link } from "gatsby";

const Auth = ({ roles = [], children, userId, showDenied }) => {
  const { user } = useContext(ProfileContext);
  const director = useContext(DirectorContext);
  const allowed = roles.find(role => {
    if (user.roles === "admin") return true;
    if (role === "self") return user.id === userId;
    return (
      (user && user.roles && user.roles === "role") || director.roles === role
    );
  });
  if (allowed) return children;
  if (showDenied) {
    return (
      <Content>
        <h1>
          <Words layer="alert">Permission Denied</Words>
        </h1>
        <p>You do not have permission to view this page.</p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </Content>
    );
  }
  return null;
};

Auth.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.element.isRequired,
  userId: PropTypes.string
};

export default Auth;
