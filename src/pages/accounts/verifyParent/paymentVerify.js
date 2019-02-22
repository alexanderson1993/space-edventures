import React from "react";
import { Loading, Blockquote } from "@arwes/arwes";
import { Button, PaymentEntry, Center, Words } from "../../../components";
import { Mutation } from "react-apollo";
import SET_PAYMENT from "./setPaymentVerify.graphql";

const PaymentVerify = ({ back, user: { id, verification = {} } }) => {
  const { stripeCustomerId } = verification;
  return (
    <div>
      <div>
        <Button onClick={back}>Go Back</Button>
      </div>
      <h2>Payment Verification</h2>
      <p>
        <strong>Instructions:</strong> Enter valid credit card information into
        the form. We will automatically check to make sure the card is valid
        using{" "}
        <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
          Stripe
        </a>
        , a trusted third-party payment platform. Note: Entering your payment
        information is only to verify you are the parent. No charges will be
        made to your credit card. A $1.00 USD hold might be placed on your
        account for up to 7 days.
      </p>
      <Mutation mutation={SET_PAYMENT}>
        {(action, { loading, data, error }) => {
          if (loading)
            return (
              <Center>
                <Loading animate />
                <p>Verifying Payment Information...</p>
              </Center>
            );
          if (stripeCustomerId || (data && data.verifyWithStripeToken)) {
            return (
              <div>
                <p>
                  <Words>Verification Successful</Words>
                </p>
                <Button block layer="success" onClick={back}>
                  Go Back
                </Button>
              </div>
            );
          }
          return (
            <div>
              <PaymentEntry
                setToken={({ token }) =>
                  action({ variables: { id, token: token.id } })
                }
              />
              {error && (
                <Blockquote layer="alert">
                  <Words>{error.message}</Words>
                </Blockquote>
              )}
            </div>
          );
        }}
      </Mutation>
    </div>
  );
};
export default PaymentVerify;
