import React from "react";
import { graphql } from "gatsby";
import { Content } from "../../components";
import css from "@emotion/css";
const Centers = ({ data }) => {
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
      {centers.map(center => (
        <div
          key={center.id}
          id={center.name}
          css={css`
            clear: both;
            img {
              float: left;
            }
            img:nth-of-type(2n) {
              float: right;
            }
          `}
        >
          {center.imageUrl && (
            <img
              src={center.imageUrl}
              alt={center.name}
              css={css`
                width: 200px;
                height: 200px;
                object-fit: contain;
                padding-right: 1em;
                padding-bottom: 1em;
              `}
            />
          )}
          <h2>{center.name}</h2>
          {center.website && (
            <p>
              <a
                href={center.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {center.website}
              </a>
            </p>
          )}
          <p>{center.address && center.address.description}</p>
          <p>{center.description}</p>
        </div>
      ))}
    </Content>
  );
};
export default Centers;

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
