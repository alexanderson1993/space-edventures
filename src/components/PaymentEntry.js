import React, { useState, useContext } from "react";
import { css } from "@emotion/core";
import { injectStripe, CardElement, Elements } from "react-stripe-elements";
import { Button, Words } from "./";
import { Loading, Blockquote, Frame } from "@arwes/arwes";
import AnimateContext from "../helpers/animateContext";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "24px",
      color: "white",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "rgba(255,255,255,0.3)"
      }
    },
    invalid: {}
  }
};

const CardInput = ({
  stripe,
  setToken,
  buttonLabel = "Validate Payment Method"
}) => {
  const [error, setError] = useState(null);
  const [validating, setValidating] = useState(false);
  const { show } = useContext(AnimateContext);
  const handleSubmit = ev => {
    ev.preventDefault();
    setValidating(true);
    if (stripe) {
      stripe.createToken().then(payload => {
        if (payload.error) {
          setValidating(false);
          setError(payload.error);
          return;
        }
        setValidating(false);
        setToken(payload);
      });
    } else {
      setValidating(false);
      setError("Stripe.js hasn't loaded yet. Try again in a minute.");
    }
  };
  return (
    <Frame show={show} animate>
      <form
        onSubmit={handleSubmit}
        css={css`
          margin: 20px;
        `}
      >
        <CardElement
          css={css`
            padding: 10px;
          `}
          onChange={obj => {
            if (obj.error && !error) {
              setError(obj.error);
            } else if (error) {
              setError(null);
            }
          }}
          {...CARD_ELEMENT_OPTIONS}
        />

        {validating ? (
          <Loading animate />
        ) : (
          <Button block>{buttonLabel}</Button>
        )}
      </form>
      {error && (
        <Blockquote layer="alert">
          <Words>{error.message || error}</Words>
        </Blockquote>
      )}
    </Frame>
  );
};
const InjectedCardInput = injectStripe(CardInput);

const CardInputWrapper = props => {
  return (
    <Elements>
      <InjectedCardInput {...props} />
    </Elements>
  );
};

export default CardInputWrapper;
