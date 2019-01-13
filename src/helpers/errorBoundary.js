import React, { Component } from "react";
import { Button } from "../components";
import styled from "@emotion/styled";

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }
  refresh() {
    localStorage.clear();
    window.location.reload();
  }
  render() {
    if (this.state.errorInfo) {
      // Error path
      if (this.props.render) return this.props.render;
      return (
        <div className="error-boundary">
          <Container>
            <h2>Error in the Space EdVentures app.</h2>
            <Button onClick={this.refresh}>Refresh</Button>

            <h3>
              If you know what you are looking for, you can check out what went
              wrong.
            </h3>
            <details style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          </Container>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
