import React, { useContext, useState } from "react";
import { Words, Input, Button, Confirm } from "../../components";
import { css } from "@emotion/core";
import { DirectorContext } from ".";
import { Query, Mutation } from "react-apollo";
import API_KEY_QUERY from "./centerApiKey.graphql";
import RESET_API_KEY from "./resetApiKey.graphql";
import graphQLHelper from "../../helpers/graphQLHelper";

export default () => {
  const { director } = useContext(DirectorContext);
  const [doQuery, setDoQuery] = useState(null);
  const [resetModal, setResetModal] = useState(false);
  return (
    <div>
      <h1>
        <Words>Settings</Words>
      </h1>
      <h2>
        <Words>API Token</Words>
      </h2>
      <p>
        <Words>
          Use the API token to authenticate your center in Thorium. This will
          allow Thorium to automatically send flight information to Space
          EdVentures after a flight. Make sure you keep your API token secret.
          Anyone who has it can access and modify data about your space center.
        </Words>
      </p>
      <div
        css={css`
          display: grid;
          grid-template-columns: auto auto auto 1fr;
          align-items: center;
          grid-gap: 10px;
        `}
      >
        <Query
          query={API_KEY_QUERY}
          variables={{ id: director.center.id }}
          skip={!doQuery}
        >
          {graphQLHelper(({ center }) => (
            <Input
              css={css`
                width: 36ch;
              `}
              readOnly
              type={center ? "text" : "password"}
              value={
                center
                  ? center.apiToken
                  : "This isn't the API token. Click that button to get it."
              }
            />
          ))}
        </Query>
        <Button onClick={() => setDoQuery(true)}>Show API Token</Button>
        <Button layer="alert" onClick={() => setResetModal(true)}>
          Reset API Token
        </Button>
        <Mutation mutation={RESET_API_KEY}>
          {action => (
            <Confirm
              label="Are you sure you want to reset the API token?"
              subText="This will deactivate the old API token and your Thorium instances won't be able to communicate with Space EdVentures until you add the new API token."
              onConfirm={() => {
                setResetModal(false);
                action().then(() => setDoQuery(true));
              }}
              onCancel={() => setResetModal(false)}
              show={resetModal}
            />
          )}
        </Mutation>
      </div>
    </div>
  );
};
