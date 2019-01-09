import React, { Component } from "react";

import Header from "./header";

import {
  Arwes,
  createLoader,
  createResponsive,
  utils,
  withStyles,
  Content,
  Footer
} from "@arwes/arwes";

import AnimateContext from "../helpers/animateContext";

const resources = {
  background: {
    small: require("../assets/img/background-small.jpg"),
    medium: require("../assets/img/background-medium.jpg"),
    large: require("../assets/img/background-large.jpg"),
    xlarge: require("../assets/img/background-xlarge.jpg")
  },
  pattern: require("../assets/img/glow.png")
};

class ArwesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loaded: false,
      hide: () => this.setState({ show: false }),
      reveal: () => this.setState({ show: true })
    };
  }

  componentDidMount() {
    this.loader = createLoader();
    this.responsive = createResponsive({
      getTheme: () => this.props.theme
    });
    this.startLoading();
  }

  startLoading() {
    const responsive = this.responsive.get();
    const background = utils.getResponsiveResource(
      resources.background,
      responsive
    );
    this.loader
      .load({ images: [background, this.profile] }, { timeout: 5 * 1000 })
      .then(() => {}, () => {})
      .then(() => this.setState({ show: true, loaded: true }));
  }

  render() {
    const { children } = this.props;
    const { show } = this.state;

    return (
      <AnimateContext.Provider value={this.state}>
        <>
          <Arwes
            animate
            show={show}
            showResources={true}
            background={resources.background}
            pattern={resources.pattern}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh"
              }}
            >
              <Content style={{ flex: 1 }}>
                <div
                  style={{
                    margin: "0 auto",
                    maxWidth: 960,
                    padding: "0px 1.0875rem 1.45rem",
                    paddingTop: 0
                  }}
                >
                  {children}
                </div>
              </Content>
            </div>
          </Arwes>
        </>
      </AnimateContext.Provider>
    );
  }
}
export default withStyles(() => {})(ArwesContainer);
