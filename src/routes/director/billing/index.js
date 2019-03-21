import React, { useContext, useState } from "react";
import GET_BILLING from "./getBilling.graphql";
import SUBSCRIBE from "./resubscribe.graphql";
import STRIPE_PLANS from "../stripePlans.graphql";
import UNSUBSCRIBE from "./unsubscribe.graphql";
import UPDATE_PAYMENT from "./updatePayment.graphql";
import { PaymentEntry, Button, Words, Confirm } from "../../../components";
import { CenterContext } from "../../../pages/director";
import { Query, Mutation } from "react-apollo";
import graphQLHelper from "../../../helpers/graphQLHelper";
import css from "@emotion/css";
import { Loading, Blockquote } from "@arwes/arwes";
import styled from "@emotion/styled";

const Padding = styled("div")`
  margin: 10px 0;
`;
function getStatus(stripeCustomer) {
  if (!stripeCustomer.subscriptions[0]) return "Not Subscribed";
  const sub = stripeCustomer.subscriptions[0];
  if (sub.status === "trialing" || sub.status === "active") return "Trialing";
  return "Terminated";
}

const SubInfo = ({ current_period_start, current_period_end, plan }) => {
  return (
    <div>
      <p>
        Period Start Date:{" "}
        {new Date(current_period_start * 1000).toLocaleDateString()}
      </p>
      <p>
        Period End Date:{" "}
        {new Date(current_period_end * 1000).toLocaleDateString()}
      </p>
      <p>
        Current Plan: ${(plan.amount / 100).toFixed(2)} /{" "}
        {plan.interval_count > 1 ? plan.interval_count : ""}
        {plan.interval}
      </p>
    </div>
  );
};

export default () => {
  const centerContext = useContext(CenterContext);
  const [payment, setPayment] = useState(false);
  const [token, setToken] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [unsubscribing, setUnsubscribing] = useState(null);
  return (
    <div>
      <h1>Billing</h1>
      <Query
        query={GET_BILLING}
        skip={!centerContext}
        variables={{ id: centerContext && centerContext.id }}
      >
        {graphQLHelper(({ center }) => (
          <Mutation
            mutation={UNSUBSCRIBE}
            variables={{ centerId: centerContext.id }}
            refetchQueries={[
              {
                query: GET_BILLING,
                variables: { id: centerContext && centerContext.id }
              }
            ]}
          >
            {(unsubscribe, { loading: unSubLoad, error: unSubError }) => (
              <Mutation
                mutation={SUBSCRIBE}
                variables={{ planId, centerId: centerContext.id }}
                refetchQueries={[
                  {
                    query: GET_BILLING,
                    variables: { id: centerContext && centerContext.id }
                  }
                ]}
              >
                {(subscribe, { loading: subLoad, error: subError }) =>
                  unSubLoad || subLoad ? (
                    <Loading animate />
                  ) : (
                    <div>
                      <p>
                        Customer Since:{" "}
                        {new Date(
                          center.stripeCustomer.created * 1000
                        ).toLocaleDateString()}
                      </p>
                      <p>Status: {getStatus(center.stripeCustomer)}</p>
                      {getStatus(center.stripeCustomer) === "Terminated" ||
                      getStatus(center.stripeCustomer) === "Not Subscribed" ? (
                        <p>
                          Please{" "}
                          {getStatus(center.stripeCustomer) === "Terminated"
                            ? "enter valid payment information"
                            : "subscribe"}{" "}
                          to reinstate your subscription.
                        </p>
                      ) : (
                        <SubInfo {...center.stripeCustomer.subscriptions[0]} />
                      )}
                      <h2>Payment Information</h2>
                      <Mutation
                        mutation={UPDATE_PAYMENT}
                        refetchQueries={[
                          {
                            query: GET_BILLING,
                            variables: { id: centerContext && centerContext.id }
                          }
                        ]}
                      >
                        {(updatePayment, { loading, error }) =>
                          loading ? (
                            <Loading animate />
                          ) : (
                            <>
                              {center.stripeCustomer.sources.length > 0 ? (
                                center.stripeCustomer.sources.map(s => (
                                  <div
                                    key={s.id}
                                    css={css`
                                      display: flex;
                                      justify-content: space-between;
                                      width: 100%;
                                      max-width: 500px;
                                    `}
                                  >
                                    <div>
                                      <strong>Brand:</strong>
                                      <p>{s.brand}</p>
                                    </div>
                                    <div>
                                      <strong>Last 4:</strong>
                                      <p>{s.last4}</p>
                                    </div>
                                    <div>
                                      <strong>Expiration:</strong>
                                      <p>
                                        {s.exp_month}/{s.exp_year}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No payment information on file.</p>
                              )}

                              {payment ? (
                                <div
                                  css={css`
                                    max-width: 500px;
                                  `}
                                >
                                  {token ? (
                                    <>
                                      <h4>
                                        <Words>Payment Method Accepted</Words>
                                      </h4>
                                      <div
                                        css={css`
                                          display: flex;
                                        `}
                                      >
                                        <Button
                                          block
                                          onClick={() => setToken(null)}
                                        >
                                          Enter Different Payment
                                        </Button>
                                        <Button
                                          block
                                          onClick={() =>
                                            updatePayment({
                                              variables: {
                                                token: token.id,
                                                centerId: center.id
                                              }
                                            }).then(() => setToken(null))
                                          }
                                        >
                                          Complete Payment Update
                                        </Button>
                                      </div>
                                    </>
                                  ) : (
                                    <PaymentEntry
                                      setToken={({ token }) => setToken(token)}
                                    />
                                  )}
                                </div>
                              ) : (
                                <Button onClick={() => setPayment(true)}>
                                  Update Payment Information
                                </Button>
                              )}
                              {error && (
                                <Blockquote layer="alert">
                                  <Words>{error.message || error}</Words>
                                </Blockquote>
                              )}
                            </>
                          )
                        }
                      </Mutation>
                      {getStatus(center.stripeCustomer) === "Terminated" ||
                      getStatus(center.stripeCustomer) === "Not Subscribed" ? (
                        <Padding>
                          <Button layer="success" onClick={subscribe}>
                            Subscribe
                          </Button>
                          <Query query={STRIPE_PLANS}>
                            {graphQLHelper(({ stripe: { plans } }) => {
                              if (plans.length === 1) {
                                const plan = plans[0];
                                if (planId !== plan.id) {
                                  setPlanId(plan.id);
                                }
                                return (
                                  <p>
                                    You will be subscribed to the{" "}
                                    {plan.nickname} plan, billed $
                                    {plan.amount / 100} every{" "}
                                    {plan.interval_count === 1
                                      ? ""
                                      : `${plan.interval_count} `}
                                    {plan.interval}.
                                  </p>
                                );
                              }
                              return <div />;
                            })}
                          </Query>
                        </Padding>
                      ) : (
                        <Padding>
                          <Button
                            layer="alert"
                            onClick={() => setUnsubscribing(true)}
                          >
                            Unsubscribe
                          </Button>
                        </Padding>
                      )}
                      <Confirm
                        show={unsubscribing}
                        label="Confirm Unsubscription"
                        onCancel={() => setUnsubscribing(false)}
                        onConfirm={() =>
                          unsubscribe().then(() => setUnsubscribing(false))
                        }
                        subText="This will deactivate the connection to your controls. You won't be able to add any more flight records and you will be removed from the center registry. Your other data will remain intact."
                      />
                      {(unSubError || subError) && (
                        <Blockquote layer="alert">
                          <Words>
                            {subError
                              ? subError.message || subError
                              : unSubError.message || unSubError}
                          </Words>
                        </Blockquote>
                      )}
                    </div>
                  )
                }
              </Mutation>
            )}
          </Mutation>
        ))}
      </Query>
    </div>
  );
};
