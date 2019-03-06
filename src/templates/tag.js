import React from "react";
import { graphql } from "gatsby";
import PostList from "../components/PostList";
import { Content, SEO } from "../components";

const Tag = props => {
  const { data, pageContext } = props;
  const { edges: posts, totalCount } = data.allWordpressPost;
  const { name: tag } = pageContext;
  const title = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } with the tag ${tag}`;

  return (
    <Content>
      <SEO title={tag} />
      <PostList posts={posts} title={title} />
    </Content>
  );
};

export default Tag;

export const pageQuery = graphql`
  query TagPage($slug: String!) {
    allWordpressPost(filter: { tags: { elemMatch: { slug: { eq: $slug } } } }) {
      totalCount
      edges {
        node {
          ...PostListFields
        }
      }
    }
  }
`;
