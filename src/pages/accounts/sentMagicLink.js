import React from "react";

const SentMagicLink = ({ location }) => {
  var urlParams = new URLSearchParams(window.location.search);
  return (
    <div>
      <h1>Magic Link Sent</h1>
      <p>
        Check your inbox! We sent an email to {urlParams.get("email")}. Click
        the link in that email to sign in to Space Edventures.
      </p>
    </div>
  );
};

export default SentMagicLink;
