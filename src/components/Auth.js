import { useContext } from "react";
import PropTypes from "prop-types";
import ProfileContext from "../helpers/profileContext";
import { DirectorContext } from "../helpers/directorContext";

const Auth = ({ roles = [], children, userId }) => {
  const { user } = useContext(ProfileContext);
  const director = useContext(DirectorContext);
  const allowed = roles.find(role => {
    if (role === "self") return user.id === userId;
    return (
      (user && user.roles && user.roles.indexOf(role) > -1) ||
      director.roles === role
    );
  });
  if (allowed) return children;
  return null;
};

Auth.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.element.isRequired,
  userId: PropTypes.string
};

export default Auth;
