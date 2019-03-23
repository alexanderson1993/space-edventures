import React, { Component, useContext, useEffect, useState } from "react";

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
import { css, Global } from "@emotion/core";
import { Link, SEO, Words } from "../components";
import ProfileContext from "../helpers/profileContext";
import { ReactComponent as Logo } from "./icon.svg";
import AuthContext from "../helpers/authContext";

const FooterContent = styled("div")`
  width: 960px;
  max-width: 80%;
  display: flex;
  justify-content: space-around;
  transition: opacity 0.2s ease;
  opacity: ${({ show }) => (show ? 1 : 0)};
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

const Intro = props => {
  const [opened, setOpened] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { children } = props;
  const { loading: authLoading } = useContext(AuthContext);
  const { user } = useContext(ProfileContext);
  useEffect(() => {
    if (!opened) {
      setOpened(true);
    }
  }, [opened]);
  useEffect(() => {
    let timeout;
    let otherTimeout;
    if (!user.loading) {
      otherTimeout = setTimeout(() => setPageLoading(false), 500);
      timeout = setTimeout(() => setLoaded(true), 750);
    }
    return () => {
      clearTimeout(timeout);
      clearTimeout(otherTimeout);
    };
  }, [user.loading]);
  return (
    <>
      <PageContent loaded={loaded}>{children}</PageContent>
      <div
        css={css`
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        `}
      >
        <Logo
          css={css`
            max-width: 30%;
            max-height: 30%;
            opacity: ${(opened && user.loading) || pageLoading ? 1 : 0};
            transition: opacity 0.2s ease;
          `}
        />
        <h1>
          <Words show={(!authLoading && user.loading) || pageLoading}>
            Space EdVentures
          </Words>
        </h1>
        <h2>
          <Words show={(!authLoading && user.loading) || pageLoading}>
            Accessing Database...
          </Words>
        </h2>
      </div>
    </>
  );
};

const PageContent = React.memo(({ children, loaded }) => {
  return (
    <>
      <Header show={loaded} />
      <div
        css={css`
          flex: 1;
          transition: opacity 0.2s ease;
          opacity: ${loaded ? 1 : 0};
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
      <Footer animate show={loaded}>
        <FooterContent show={loaded}>
          <span>
            <Link to="/support/privacy">Privacy Policy</Link> |{" "}
            <Link to="/support/tos">Terms of Service</Link>
          </span>
          <span>Copyright © {new Date().getFullYear()}</span>
        </FooterContent>
      </Footer>
    </>
  );
});
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
        <Arwes
          animate
          show={show}
          background={
            isAdmin ? adminResources.background : resources.background
          }
          pattern={isAdmin ? adminResources.pattern : resources.pattern}
        >
          <Global
            styles={css`
              html,
              body {
                font-family: sans-serif;
                background-color: black;
                color: white;
                padding: 0;
              }
              button + button,
              a + a {
                margin-right: 10px;
              }
              .splashPoints {
                margin: 30px 0;
              }
              img {
                max-width: 100%;
              }
            `}
          />
          <SEO />
          <Content
            css={css`
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            `}
          >
            <Intro>{children}</Intro>
          </Content>
        </Arwes>
      </AnimateContext.Provider>
    );
  }
}
export default withStyles(() => {})(ArwesContainer);
