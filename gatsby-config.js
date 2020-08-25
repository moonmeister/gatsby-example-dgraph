module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-dgraph`,
      options: {
        endpoint: `https://vague-bell.us-west-2.aws.cloud.dgraph.io/graphql`,
        token: `psnq3YFUaEx0JlE+UCbJ8TdUCgY4cHaumhA2wryWY8o=`,
      }
    },
  ],
}