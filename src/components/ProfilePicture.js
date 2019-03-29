import React, { useState, useContext } from "react";
import { Image } from "../components";
import ProfileContext from "../helpers/profileContext";
import css from "@emotion/css";

const ProfilePicture = props => {
  const [error, setError] = useState(false);
  const { user = {} } = useContext(ProfileContext);
  const { profile } = user;

  return (
    <div
      css={css`
        position: relative;
        min-width: 52px;
      `}
    >
      <div
        css={css`
          padding-top: 100%;
        `}
      />
      <Image
        src={
          !profile || !profile.profilePicture || error
            ? require("../assets/avatar.jpeg")
            : profile.profilePicture
        }
        css={css`
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          object-fit: contain;
        `}
        {...props}
        alt="Profile"
        imgProps={{
          onError: () => {
            setError(true);
          }
        }}
      />
    </div>
  );
};

export default ProfilePicture;
