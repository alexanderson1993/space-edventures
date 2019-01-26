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
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { AdminContext } from "./arwesProvider";

const Center = styled("div")`
  text-align: center;
`;

const resources = {
  background: {
    small: require("../assets/img/background-small.jpg"),
    medium: require("../assets/img/background-medium.jpg"),
    large: require("../assets/img/background-large.jpg"),
    xlarge: require("../assets/img/background-xlarge.jpg")
  },
  pattern: require("../assets/img/glow.png")
};
const adminResources = {
  background: {
    small: require("../assets/img/background-small-admin.jpg"),
    medium: require("../assets/img/background-medium-admin.jpg"),
    large: require("../assets/img/background-large-admin.jpg"),
    xlarge: require("../assets/img/background-xlarge-admin.jpg")
  },
  pattern: require("../assets/img/glow-admin.png")
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
    const adminBackground = utils.getResponsiveResource(
      adminResources.background,
      responsive
    );
    this.loader
      .load(
        { images: [background, this.profile, adminBackground] },
        { timeout: 5 * 1000 }
      )
      .then(() => {}, () => {})
      .then(() => this.setState({ show: true, loaded: true }));
  }
  render() {
    const { children, isAdmin } = this.props;
    const { show } = this.state;
    return (
      <AnimateContext.Provider value={this.state}>
        <>
          <Arwes
            animate
            show={show}
            background={
              isAdmin ? adminResources.background : resources.background
            }
            pattern={isAdmin ? adminResources.pattern : resources.pattern}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh"
              }}
            >
              <Header show={show} />
              <Content
                css={css`
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                `}
              >
                {children}
              </Content>
              <Footer animate>
                <Center>Copyright © 2018</Center>
              </Footer>
            </div>
          </Arwes>
        </>
      </AnimateContext.Provider>
    );
  }
}
export default withStyles(() => {})(ArwesContainer);
