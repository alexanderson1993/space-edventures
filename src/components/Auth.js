import { useContext } from "react";
import AuthContext from "../helpers/authContext";

const Auth = ({ roles, children, userId }) => {
  const { user } = useContext(AuthContext);
  const allowed = roles.find(role => {
    if (role === "self") return user.id === userId;
    return user.roles.indexOf(role) > -1;
  });
  if (allowed) return children;
  return null;
};

export default Auth;
