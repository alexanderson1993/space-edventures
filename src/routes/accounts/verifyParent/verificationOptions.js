import React, { useState } from "react";
import { Button, Words, Center } from "../../../components";
import PaymentVerify from "./paymentVerify";
import PhotoVerify from "./photoVerify";
import css from "@emotion/css";
import { Loading, Blockquote } from "@arwes/arwes";
import { Mutation } from "react-apollo";
import CONFIRM_VERIFY from "./completeVerify.graphql";

const VerificationOptions = ({ user }) => {
  const verification = user.verification || {};
  const [whichVerification, setWhichVerification] = useState();

  if (!user.locked) {
    return (
      <div>
        <h2>Congratulations!</h2>
        <p>
          The verification process is complete. Your child's account is unlocked
          and they can begin to use Space EdVentures to track their flight and
          class hours and earn rank advancements.
        </p>
        <p>
          If at any time you wish to revoke your consent or remove your child's
          data, feel free to contact us at{" "}
          <a href="mailto:hello@spaceedventures.org">
            hello@spaceedventures.org
          </a>
          .
        </p>
      </div>
    );
  }
  if (whichVerification === "payment")
    return (
      <PaymentVerify back={() => setWhichVerification(false)} user={user} />
    );

  if (whichVerification === "photo")
    return <PhotoVerify back={() => setWhichVerification(false)} user={user} />;

  return (
    <Mutation mutation={CONFIRM_VERIFY} variables={{ userId: user.id }}>
      {(action, { loading, error, data }) =>
        loading || data ? (
          <Center>
            <Loading animate />
            Processing Verification...
          </Center>
        ) : (
          <div>
            <p>
              To verify you are the parent of your child, we will need to
              collect the following information. Following verification, all
              information that we collect for verification will be deleted. Both
              verification methods are required.{" "}
              <a
                href="https://www.ftc.gov/tips-advice/business-center/guidance/complying-coppa-frequently-asked-questions#Verifiable%20Parental"
                target="_blank"
                rel="noopener noreferrer"
              >
                See the FTC's website on COPPA compliance
              </a>{" "}
              for more information.
            </p>
            <div
              css={css`
                margin-bottom: 50px;
              `}
            >
              <h2>Method 1: Payment Information</h2>
              <p>
                Note: Entering your payment information is only to verify you
                are the parent. No charges will be made to your credit card. A
                $1.00 USD hold might be placed on your account for up to 7 days.
              </p>
              <Button
                layer={verification.stripeCustomerId ? "success" : "primary"}
                onClick={() => setWhichVerification("payment")}
              >
                {verification.stripeCustomerId
                  ? "Payment Verification Complete"
                  : "Begin Payment Verification"}
              </Button>
            </div>
            <div
              css={css`
                margin-bottom: 50px;
              `}
            >
              <h2>Method 2: Photo ID</h2>
              <Button
                layer={
                  verification.parentPhotoUrl && verification.idPhotoUrl
                    ? "success"
                    : "primary"
                }
                onClick={() => setWhichVerification("photo")}
              >
                {verification.parentPhotoUrl && verification.idPhotoUrl
                  ? "Photo ID Verification Complete"
                  : "Begin Photo ID Verification"}
              </Button>
            </div>
            {verification.parentPhotoUrl &&
              verification.idPhotoUrl &&
              verification.stripeCustomerId && (
                <div>
                  <h2>Step 3: Complete Verification</h2>
                  <p>
                    <em>
                      By clicking the button below, I consent to my child using
                      the Space EdVentures website. I affirm that I have read
                      and understand the{" "}
                      <a
                        href="https://spaceedventures.org/privacyPolicy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://spaceedventures.org/termsOfService"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </a>{" "}
                      and agree to their terms on behalf of my child.
                    </em>
                  </p>
                  <Button onClick={action}>I Give My Child Consent</Button>
                  {error && (
                    <Blockquote layer="alert">
                      <Words>{error.message}</Words>
                    </Blockquote>
                  )}
                </div>
              )}
          </div>
        )
      }
    </Mutation>
  );
};
export default VerificationOptions;
