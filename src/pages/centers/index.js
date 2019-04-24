import React from "react";
import { graphql } from "gatsby";
import { Content } from "../../components";
const Ranks = ({ data }) => {
  const centers = data.centers.edges
    .map(r => ({
      ...r.node
    }))
    .sort(() => {
      return Math.random() > 0.5 ? 1 : -1;
    });
  return (
    <Content>
      <h1>Centers</h1>
      {centers.map(c => (
        <div key={c.id} id={c.name}>
          <h2>{c.name}</h2>
          <p>{c.description}</p>
        </div>
      ))}
    </Content>
  );
};
export default Ranks;

export const pageQuery = graphql`
  query FirebaseCenters {
    centers: allFirebaseCenters {
      edges {
        node {
          id
          name
          website
          address {
            description
          }
          imageUrl
          description
        }
      }
    }
  }
`;
