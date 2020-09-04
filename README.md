# Gatsby Example Dgraph

This was built for a talk first given at [GraphQL in Space](https://www.graphqlcon.space/) in September of 2020. Feel free to use this as a reference to understand the various technologies. 

> ⚠️**DISCLAIMER**⚠️: This code and methods it takes to acomplish certain tasks (especially incremental builds) were thrown together in less than a week as a proof of concept for a conference talk. There's how I would acomplish this in production, then there is the steaming pile of 💩 that is this code. Proceed at your own risk and feel free to ask quesitons. 

## The Talk

  - AMA: https://discuss.dgraph.io/t/alex-moon-serverless-web-apps-with-gatsby-dgraph-tinacms/9979
  - Slides: https://docs.google.com/presentation/d/1Lhvh4dDwpYOpx7BVafXIM-RU5KxXojlFTN0g3attCWQ/edit?usp=sharing
  - Video: [FUTURE CONTENT]
  - Find all my social links and ways to contact me on my site @ https://moonmeister.net

### Serverless Web Apps with Gatsby + Dgraph + TinaCMS

More and more folks are looking to build highly dynamic web apps that deploy via static assets to a CDN. Gatsby has been a leader in this space and has a great story around sourcing data from a wide variety of CMSes. That same story hasn’t been true when looking to source data from a database. Existing solutions have generally been highly custom and complex or all together sub-par.

The good news is this is changing, Gatsby has recently released to beta its GraphQL source toolkit that uses schema queries to integrate any GraphQL source quickly and easily into Gatsby’s data layer. This is already driving new CMS integrations such as CraftCMS and GraphCMS. With Dgraph now shipping full GraphQL compatibility we have the ability to much more simply integrate our Gatsby frontend with a world-class database.

Join us to learn more about building highly scalable web apps deployed at the edge using Gatsby, Dgraph, and TinaCMS.

### Content Links

  - [Dgraph](https://dgraph.io/)
  - [Slash GraphQL](https://dgraph.io/slash-graphql)(Dgraph's cloud database offering)
  - [TinaCMS](https://tinacms.org/)
  - [Gatsby](https://gatsbyjs.com)
    - [Gatsby file system routing docs](https://www.gatsbyjs.com/docs/file-system-page-creation/)
    - [Gatsby GraphQL Source Toolkit](https://github.com/gatsbyjs/gatsby-graphql-toolkit)


## The Site

Check out the live site @ http://moviedatabase.moonmeister.net

Info: 
- Built and deployed using [Gatsby Cloud](https://www.gatsbyjs.com/cloud/)
- Deployed on the [Fastly CDN](https://www.fastly.com/)

## The Code

This code is known to not be the best way to do things and even has KNOWN bugs. 

See the talk for more info...or maybe I'll add some one day (Honest me: Yeah, that's not going to happen.)


