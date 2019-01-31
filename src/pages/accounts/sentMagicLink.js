import React from "react";
import { Content } from "../../components";

const SentMagicLink = ({ location }) => {
  var urlParams = new URLSearchParams(window.location.search);
  return (
    <Content>
      <h1>Magic Link Sent</h1>
      <p data-testid="magic-link-text">
        Check your inbox! We sent an email to {urlParams.get("email")}. Click
        the link in that email to sign in to Space Edventures.
      </p>
    </Content>
  );
};

export default SentMagicLink;
