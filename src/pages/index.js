import React, { useContext } from "react";
import { graphql } from "gatsby";
import { Link, Center, Button, Content, Words } from "../components";
import styled from "@emotion/styled";
import ProfileContext from "../helpers/profileContext";
import { default as GImg } from "gatsby-image";
import css from "@emotion/css";
import UserPage from "../routes/user";

const Header = styled("h1")`
  text-align: center;
`;

const Section = styled("section")`
  width: 100%;
  display: flex;
  margin: 2em 0;

  .text-body {
    flex: 4;
    margin-left: 2em;
  }
`;

const Splash = ({ data }) => {
  const { user } = useContext(ProfileContext);
  if (user && user.email) {
    return <UserPage />;
  }
  if (user.loading) return null;
  const images = data.front.edges.map(d => ({
    ...d.node.childImageSharp.fluid,
    name: d.node.name
  }));
  return (
    <Content>
      <Center>
        <Header className="text-center">
          <Words>Join the Space Center community and track your rank!</Words>
        </Header>
        <div>
          <Link to="/accounts/login?signUp">
            <Button>Join Now</Button>
          </Link>
        </div>
        <Section>
          <GImg
            fluid={images[0]}
            alt={images[0].name}
            css={css`
              flex: 2;
            `}
          />
          <div className="text-body">
            <h2>
              <Words>Track your Flights and Missions</Words>
            </h2>
            <p>
              <Words>
                Keep track of each and every one of your flights at any
                participating space center, know what missions you've flown, and
                what simulators you've been on.
              </Words>
            </p>
          </div>
        </Section>
        <Section>
          <div className="text-body">
            <h2>
              <Words>Earn Ranks</Words>
            </h2>
            <p>
              <Words>
                The hours that you earn at the space centers will go towards
                earning different ranks. Each rank will give you more leverage
                when selecting stations or simulators on future flights. And the
                ranks transfer between space centers!
              </Words>
            </p>
          </div>
          <GImg
            fluid={images[2]}
            alt={images[2].name}
            css={css`
              flex: 2;
            `}
          />
        </Section>
        <Section>
          <GImg
            fluid={images[3]}
            alt={images[3].name}
            css={css`
              flex: 2;
            `}
          />
          <div className="text-body">
            <h2>
              <Words>Collect Officer Logs</Words>
            </h2>
            <p>
              <Words>
                Want to keep your memories from the mission? Every officer log
                you write during a flight will automatically be collected and
                stored on Space EdVentures. Go back and relive your experiences.
              </Words>
            </p>
          </div>
        </Section>
      </Center>
    </Content>
  );
};
export default Splash;

export const query = graphql`
  query {
    front: allFile(filter: { dir: { glob: "**/front" } }) {
      edges {
        node {
          id
          name
          childImageSharp {
            fluid(
              quality: 70
              maxWidth: 1000
              traceSVG: { background: "black", color: "#333" }
            ) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }
  }
`;
