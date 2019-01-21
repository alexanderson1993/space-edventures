import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import graphQLHelper from "../../helpers/graphQLHelper";

const GraphQL = () => {
  return (
    <div>
      <h1>GraphQL Test</h1>
      <h2>Loading</h2>
      <Query
        query={gql`
          query Loading {
            loading
          }
        `}
      >
        {graphQLHelper(({ loading }) => loading)}
      </Query>
      <h2>Network Error</h2>
      <Query
        query={gql`
          query Loading {
            broken
          }
        `}
      >
        {graphQLHelper(() => "Borken")}
      </Query>
      <h2>Authentication Error</h2>
      <Query
        query={gql`
          query Loading {
            authenticationError
          }
        `}
      >
        {graphQLHelper(() => "Borken")}
      </Query>
      <h2>User Input Error</h2>
      <Query
        query={gql`
          query Loading {
            userInputError
          }
        `}
      >
        {graphQLHelper(() => "Borken")}
      </Query>
      <h2>Multiple Errors</h2>
      <Query
        query={gql`
          query Loading {
            authenticationError
            userInputError
          }
        `}
      >
        {graphQLHelper(() => "Borken")}
      </Query>
    </div>
  );
};
export default GraphQL;
