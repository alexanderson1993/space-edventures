import React from "react";
import { graphql } from "gatsby";
import PostList from "../components/PostList";
import { SEO, Content } from "../components";

const Author = props => {
  const { data } = props;
  const { authored_wordpress__POST = [], name } = data.wordpressWpUsers;
  const totalCount =
    (authored_wordpress__POST && authored_wordpress__POST.length) || 0;
  const title = `${totalCount} post${totalCount === 1 ? "" : "s"} by ${name}`;

  // The `authored_wordpress__POST` returns a simple array instead of an array
  // of edges / nodes. We therefore need to convert the array here.
  console.log(authored_wordpress__POST);
  const authoredPosts = authored_wordpress__POST || [];
  const posts = authoredPosts.map(post => ({
    node: post
  }));

  return (
    <Content>
      <SEO title={name} />
      <PostList posts={posts} title={title} />
    </Content>
  );
};

export default Author;

export const pageQuery = graphql`
  query AuthorPage($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    wordpressWpUsers(id: { eq: $id }) {
      name
      authored_wordpress__POST {
        ...PostListFields
      }
    }
  }
`;
