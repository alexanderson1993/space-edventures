import React, { useState } from "react";
import { Button } from "../../../components";
import PaymentVerify from "./paymentVerify";
import PhotoVerify from "./photoVerify";
import css from "@emotion/css";

const VerificationOptions = ({ user }) => {
  const verification = user.verification || {};
  const [whichVerification, setWhichVerification] = useState("photo");

  if (whichVerification === "payment")
    return (
      <PaymentVerify back={() => setWhichVerification(false)} user={user} />
    );

  if (whichVerification === "photo")
    return <PhotoVerify back={() => setWhichVerification(false)} user={user} />;

  return (
    <div>
      <p>
        To verify you are the parent of your child, we will need to collect the
        following information. Following verification, all information that we
        collect for verification will be deleted. Both verification methods are
        required.{" "}
        <a
          href="https://www.ftc.gov/tips-advice/business-center/guidance/complying-coppa-frequently-asked-questions#Verifiable%20Parental"
          target="_blank"
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
          Note: Entering your payment information is only to verify you are the
          parent. No charges will be made to your credit card. A $1.00 USD hold
          might be placed on your account for up to 7 days.
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
    </div>
  );
};
export default VerificationOptions;
