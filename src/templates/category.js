import React from "react";
import { graphql } from "gatsby";
import PostList from "../components/PostList";
import { Content, SEO } from "../components";

const Category = props => {
  const { data, pageContext } = props;
  const { edges: posts, totalCount } = data.allWordpressPost;
  const { name: category } = pageContext;
  const title = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } in the “${category}” category`;

  return (
    <Content>
      <SEO title={category} />
      <PostList posts={posts} title={title} />
    </Content>
  );
};

export default Category;

export const pageQuery = graphql`
  query CategoryPage($slug: String!) {
    allWordpressPost(
      filter: { categories: { elemMatch: { slug: { eq: $slug } } } }
    ) {
      totalCount
      edges {
        node {
          ...PostListFields
        }
      }
    }
  }
`;
