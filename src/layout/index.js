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
import { Link, SEO } from "../components";

const FooterContent = styled("div")`
  width: 960px;
  max-width: 80%;
  display: flex;
  justify-content: space-around;
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
      hide: () => null, //this.setState({ show: false }),
      reveal: () => null // this.setState({ show: true })
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
            <SEO />
            <Content
              css={css`
                display: flex;
                flex-direction: column;
                min-height: 100vh;
              `}
            >
              <Header show={show} />
              <div
                css={css`
                  flex: 1;
                  & > div {
                    min-height: calc(100vh - 111px);
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                  }
                `}
              >
                {children}
              </div>
              <Footer animate>
                <FooterContent>
                  <span>
                    <Link to="/support/privacy">Privacy Policy</Link> |{" "}
                    <Link to="/support/tos">Terms of Service</Link>
                  </span>
                  <span>Copyright © 2018</span>
                </FooterContent>
              </Footer>
            </Content>
          </Arwes>
        </>
      </AnimateContext.Provider>
    );
  }
}
export default withStyles(() => {})(ArwesContainer);
