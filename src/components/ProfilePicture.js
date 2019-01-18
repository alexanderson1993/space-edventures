import React, { useState, useContext } from "react";
import { Image } from "../components";
import ProfileContext from "../helpers/profileContext";

const ProfilePicture = props => {
  const [error, setError] = useState(false);
  const { user } = useContext(ProfileContext);
  return (
    <Image
      src={
        !user.profile || error ? require("../assets/avatar.jpeg") : user.profile
      }
      {...props}
      alt="Profile"
      imgProps={{
        onError: () => {
          setError(true);
        }
      }}
    />
  );
};

export default ProfilePicture;
