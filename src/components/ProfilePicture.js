import React, { useState, useContext } from "react";
import { Image } from "../components";
import ProfileContext from "../helpers/profileContext";

const ProfilePicture = props => {
  const [error, setError] = useState(false);
  const { user = {} } = useContext(ProfileContext);
  const { profile } = user;

  return (
    <Image
      src={
        !profile || !profile.profilePicture || error
          ? require("../assets/avatar.jpeg")
          : profile.profilePicture
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
