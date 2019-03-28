import React from "react";
import { Content, Link } from "../components";
import { graphql } from "gatsby";
import css from "@emotion/css";

const DocsTemplate = ({ data: { doc, docs } }) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-around;
      `}
    >
      <aside
        css={css`
          padding: 1.0875rem 1.45rem;
        `}
      >
        <h2>Documentation</h2>
        {docs.edges.map(({ node: doc }) => (
          <p
            key={doc.id}
            css={css`
              margin-left: 1em !important;
              margin-bottom: 0.5em !important;
            `}
          >
            <Link to={`/docs/${doc.fields.slug.replace(/.*\d-/, "")}`}>
              {doc.frontmatter.title}
            </Link>
          </p>
        ))}
      </aside>
      <Content
        css={css`
          margin: 0;
        `}
      >
        <h1>{doc.frontmatter.title}</h1>
        <article>{require("html-react-parser")(doc.html)}</article>
      </Content>
    </div>
  );
};
export default DocsTemplate;

export const pageQuery = graphql`
  query Page($id: String!) {
    doc: markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
      }
    }
    docs: allMarkdownRemark(
      filter: { fileAbsolutePath: { glob: "**/docs/**" } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
