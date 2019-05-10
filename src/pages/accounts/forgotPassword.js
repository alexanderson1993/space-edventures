import React from "react";
import { Content } from "../../components";

const ForgotPassword = ({ location }) => {
  var urlParams = new URLSearchParams(
    typeof window !== "undefined" && window.location.search
  );
  return (
    <Content>
      <h1>Password Reset Email Sent</h1>
      <p data-testid="magic-link-text">
        Check your inbox! We sent an email to {urlParams.get("email")}. Click
        the link in that email to reset your password.
      </p>
    </Content>
  );
};

export default ForgotPassword;
