import { StripeProvider } from "react-stripe-elements";
import React, { Component } from "react";

// TODO: Add production stripe key
const PUB_KEY = process.env.REACT_APP_IS_LIVE
  ? "pk_test_oGcUy9t6hiRpmVPS6c6L9MJe"
  : "pk_test_oGcUy9t6hiRpmVPS6c6L9MJe";

export default class StripeAPIProvider extends Component {
  state = { stripe: null };
  componentDidMount() {
    if (window.Stripe) {
      this.setState({ stripe: window.Stripe(PUB_KEY) });
    } else {
      const script = document.querySelector("#stripe-js");
      script &&
        script.addEventListener("load", () => {
          // Create Stripe instance once Stripe.js loads
          this.setState({ stripe: window.Stripe(PUB_KEY) });
        });
    }
  }
  render() {
    const { stripe } = this.state;
    return (
      <StripeProvider stripe={stripe}>{this.props.children}</StripeProvider>
    );
  }
}
