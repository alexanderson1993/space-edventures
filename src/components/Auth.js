import React, { useContext } from "react";
import PropTypes from "prop-types";
import ProfileContext from "../helpers/profileContext";
import { DirectorContext } from "../helpers/directorContext";
import { Words, Content, Button } from ".";
import { Link } from "gatsby";

const Auth = ({ roles = [], children, userId }) => {
  const { user } = useContext(ProfileContext);
  const director = useContext(DirectorContext);
  console.log(roles, user, director);
  const allowed = roles.find(role => {
    if (role === "self") return user.id === userId;
    return (
      (user && user.roles && user.roles.indexOf(role) > -1) ||
      director.roles === role
    );
  });
  if (allowed) return children;
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
};

Auth.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.element.isRequired,
  userId: PropTypes.string
};

export default Auth;
