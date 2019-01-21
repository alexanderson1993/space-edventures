import React from "react";
import { Loading } from "@arwes/arwes";

const defaultLoading = () => <Loading animate />;
const defaultError = ({ error: { networkError, graphQLErrors } }) => {
  if (networkError)
    return (
      <div>
        <p>Error Loading Data: </p>
        <p>
          <code>{networkError.message}</code>
        </p>
        <p>
          If you are seeing this, then there is something very wrong, and it
          should be addressed as soon as possible.
        </p>
      </div>
    );
  if (graphQLErrors.length > 0) {
    return (
      <div>
        <p>Error Loading Data: </p>
        <ul>
          {graphQLErrors.map((g, i) => (
            <li key={`error-${i}`}>
              {g.message} - <code>{g.extensions.code}</code>
              <details style={{ whiteSpace: "pre-wrap" }}>
                {g.extensions.exception.stacktrace.join("\n")}
              </details>
            </li>
          ))}
        </ul>
        <p>
          If you are seeing this, you should probably create a nicer error
          experience.
        </p>
      </div>
    );
  }
  return null;
};

export default function graphQLHelper(
  Comp,
  ErrorComp = defaultError,
  LoadingComp = defaultLoading
) {
  return ({ loading, error, data }) => {
    if (loading) return <LoadingComp />;
    if (error) return <ErrorComp error={error} />;
    return <Comp {...data} />;
  };
}
