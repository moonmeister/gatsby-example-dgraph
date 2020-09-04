if (!process.env.GATSBY_CLOUD) {
  require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
  })
}

module.exports = {
  siteMetadata: {
    branch: process.env.BRANCH || "Development",
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-preact`,
    'gatsby-plugin-linaria',
    {
      resolve: `gatsby-source-dgraph`,
      options: {
        endpoint: process.env.GATSBY_SLASH_GRPAHQL_ENDPOINT || `https://vague-bell.us-west-2.aws.cloud.dgraph.io/graphql`,
        include: [`Film`],
        limit: 25
      }
    },
    {
      resolve: "gatsby-plugin-tinacms",
      options: {
        sidebar: {
          hidden: process.env.NODE_ENV === "production",
          position: "displace",
        },
        plugins: [`gatsby-tinacms-dgraph`],
      },
    },
    `abhi-plugin-fastly`,
  ],
}