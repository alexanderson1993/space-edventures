module.exports = {
  siteMetadata: {
    title: "Space EdVentures",
    titleTemplate: "%s · Look Beyond",
    description:
      "Track your space center rank and points, earn rewards, and see new missions and simulators all in one place.",
    url: "https://spaceedventures.org", // No trailing slash allowed!
    image: "/images/seo-image.jpg", // Path to your image you placed in the 'static' folder
    twitterUsername: "@thoriumsim"
  },
  plugins: [
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: "gatsby-source-wordpress",
      options: {
        // The base url to your WP site.
        baseUrl: "blogspaceedventures.wordpress.com",
        // WP.com sites set to true, WP.org set to false
        hostingWPCOM: true,

        // The protocol. This can be http or https.
        protocol: "https",
        // Use 'Advanced Custom Fields' Wordpress plugin
        useACF: false,
        auth: {
          wpcom_app_clientSecret: process.env.WP_CLIENT_SECRET,
          wpcom_app_clientId: "64923",
          wpcom_user: process.env.WP_USER,
          wpcom_pass: process.env.WP_PASS
        },
        // Set to true to debug endpoints on 'gatsby build'
        verboseOutput: false
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#48DBDB`,
        theme_color: `#48DBDB`,
        display: `minimal-ui`,
        icon: `src/images/icon.png` // This path is relative to the root of the site.
      }
    },
    {
      resolve: "gatsby-plugin-svgr",
      options: {
        prettier: true, // use prettier to format JS code output (default)
        svgo: true, // use svgo to optimize SVGs (default)
        svgoConfig: {
          removeViewBox: true, // remove viewBox even when doing so is possible (default)
          cleanupIDs: true // remove unused IDs and minify remaining IDs (default)
        }
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        // Exclude specific pages or groups of pages using glob parameters
        // See: https://github.com/isaacs/minimatch
        exclude: ["/director/*", `/admin/*`]
      }
    },

    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/director/*`, `/admin/*`, `/staff/*`] }
    }
  ]
};
