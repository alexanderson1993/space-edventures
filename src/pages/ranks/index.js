import React from "react";
import { graphql } from "gatsby";
import { Content } from "../../components";
import css from "@emotion/css";
const Ranks = ({ data }) => {
  const ranks = data.ranks.edges
    .map(r => ({
      ...r.node
    }))
    .sort((a, b) => {
      if (a.flightHours + a.classHours > b.flightHours + b.classHours) return 1;
      if (a.flightHours + a.classHours < b.flightHours + b.classHours)
        return -1;
      return 0;
    });
  return (
    <Content>
      <h1>Ranks</h1>
      {ranks.map(r => {
        const svg = ".svg";
        const rankSrc = `/images/ranks/${r.name}${svg}`;
        return (
          <div
            key={r.id}
            id={r.name}
            css={css`
              display: flex;
              flex-wrap: wrap;
              img {
                width: 150px;
                height: 150px;
              }
            `}
          >
            <img src={rankSrc} alt={r.name} />
            <div
              css={css`
                flex: 1;
              `}
            >
              <h2>{r.name}</h2>
              <p>
                Flight Hours: {r.flightHours} · Class Hours: {r.classHours}
              </p>
              <p>{r.description}</p>
            </div>
          </div>
        );
      })}
    </Content>
  );
};
export default Ranks;

export const pageQuery = graphql`
  query FirebaseRanks {
    ranks: allFirebaseRank {
      edges {
        node {
          id
          name
          classHours
          flightHours
          description
        }
      }
    }
  }
`;
