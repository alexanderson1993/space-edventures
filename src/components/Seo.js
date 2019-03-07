import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

const SEO = ({ title, description, image, pathname, article }) => {
  const titleTemplate = "%s · Look Beyond";
  const siteUrl = "https://spaceedventures.org";
  const twitterUsername = "@thoriumsim";

  const seo = {
    title: title,
    description: description,
    image: `${siteUrl}${image}`,
    url: `${siteUrl}${pathname || "/"}`
  };

  return (
    <>
      <Helmet title={seo.title} titleTemplate={titleTemplate}>
        <meta name="description" content={seo.description} />
        <meta name="image" content={seo.image} />
        {seo.url && <meta property="og:url" content={seo.url} />}
        {(article ? true : null) && (
          <meta property="og:type" content="article" />
        )}
        {seo.title && <meta property="og:title" content={seo.title} />}
        {seo.description && (
          <meta property="og:description" content={seo.description} />
        )}
        {seo.image && <meta property="og:image" content={seo.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        {twitterUsername && (
          <meta name="twitter:creator" content={twitterUsername} />
        )}
        {seo.title && <meta name="twitter:title" content={seo.title} />}
        {seo.description && (
          <meta name="twitter:description" content={seo.description} />
        )}
        {seo.image && <meta name="twitter:image" content={seo.image} />}
      </Helmet>
    </>
  );
};

export default SEO;

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  pathname: PropTypes.string,
  article: PropTypes.bool
};

SEO.defaultProps = {
  title: "Space EdVentures",
  description:
    "Track your space center rank and points, earn rewards, and see new missions and simulators all in one place.",
  image: "/images/seo-image.jpg",
  pathname: null,
  article: false
};
