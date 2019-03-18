import React from "react";
import { Content } from "../../../components";
import GetUser from "./getUser";
import VerificationOptions from "./verificationOptions";

const VerifyParent = props => {
  const urlParams = new URLSearchParams(
    typeof window !== "undefined" && window.location.search
  );
  const id = urlParams.get("id");
  return (
    <Content>
      <h1>Parent Permission Verification</h1>
      {id ? (
        <GetUser id={id}>
          {({ user }) => <VerificationOptions user={user} />}
        </GetUser>
      ) : (
        <p>
          There was an error reading the user's ID. Please make sure you typed
          in the URL correctly.
        </p>
      )}
    </Content>
  );
};
export default VerifyParent;
