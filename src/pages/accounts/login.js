import React, { Component } from "react";

import { Input, Button, Navigator } from "../../components";
import UserContext from "../../helpers/userContext";

class Login extends Component {
  state = {};
  render() {
    const { signUp, to = "/" } = this.props;
    return (
      <div style={{ maxWidth: "540px" }}>
        <UserContext.Consumer>
          {({ login }) => (
            <Navigator>
              {navigate => (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    login(this.state.email);
                    navigate(to);
                  }}
                >
                  <div>
                    <label>Email: </label>
                    <Input
                      type="email"
                      onChange={e => this.setState({ email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Password: </label>
                    <Input type="password" />
                  </div>
                  {signUp && (
                    <div>
                      <label>Confirm Password: </label>
                      <Input type="password" />
                    </div>
                  )}
                  <div>
                    <Button type="submit">
                      {signUp ? "Create Account" : "Login"}
                    </Button>
                  </div>
                </form>
              )}
            </Navigator>
          )}
        </UserContext.Consumer>
      </div>
    );
  }
}
export default Login;
