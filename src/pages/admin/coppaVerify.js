import React from "react";
import GET_ACCOUNTS from "./getUnverifiedAccounts.graphql";
import graphQLHelper from "../../helpers/graphQLHelper";
import { Query, Mutation } from "react-apollo";
import css from "@emotion/css";
import { Button } from "../../components";
import VERIFY_VALIDATION from "./validateVerification.graphql";
import { Loading } from "@arwes/arwes";

const CoppaVerify = () => {
  return (
    <div>
      <h1>COPPA Account Verification</h1>
      <Query query={GET_ACCOUNTS}>
        {graphQLHelper(({ usersVerified }) =>
          usersVerified.length === 0
            ? "No Verifications Pending"
            : usersVerified.map(u => (
                <div
                  key={u.id}
                  css={css`
                    border: solid 2px rgba(255, 255, 255, 0.5);
                    margin: 10px;
                    padding: 5px;
                    display: flex;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    height: 170px;
                  `}
                >
                  <div>
                    <div>Email: {u.email}</div>
                    <div>
                      Registered:{" "}
                      {new Date(u.registeredDate).toLocaleDateString()}
                    </div>
                    <div>
                      Stripe Customer ID: {u.verification.stripeCustomerId}
                    </div>
                  </div>
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      height: 100%;
                    `}
                  >
                    <img
                      css={css`
                        flex: 1;
                        height: 120px;
                      `}
                      src={u.verification.parentPhotoUrl}
                      alt="parent"
                    />
                    Parent Photo
                  </div>
                  <div
                    css={css`
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      height: 100%;
                    `}
                  >
                    <img
                      css={css`
                        flex: 1;
                        height: 120px;
                      `}
                      src={u.verification.idPhotoUrl}
                      alt="id"
                    />
                    ID Photo
                  </div>
                  <Mutation
                    mutation={VERIFY_VALIDATION}
                    refetchQueries={[{ query: GET_ACCOUNTS }]}
                  >
                    {(action, { loading }) =>
                      loading ? (
                        <Loading animate />
                      ) : (
                        <div>
                          <Button
                            block
                            layer="success"
                            onClick={() =>
                              action({
                                variables: { userId: u.id, validated: true }
                              })
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            block
                            layer="alert"
                            onClick={() =>
                              action({
                                variables: { userId: u.id, validated: false }
                              })
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )
                    }
                  </Mutation>
                </div>
              ))
        )}
      </Query>
    </div>
  );
};

export default CoppaVerify;
