import * as React from "react"
import { graphql, unstable_collectionGraphql, Link } from "gatsby"

import Layout from "../../components/Layout"

export default function FilmPage({ data }) {
  const { dgraphFilm: filmData } = data

  return (
    <Layout enableEditing={true} explain={"This page may be edited and previewed here, but is static content sourced at build time. Upon saving edits a incremental build is triggered and delpyed to the Fastly CDN in about 30 seconds."}>
      <article>
        <h1>{filmData.name}</h1>
        <div dangerouslySetInnerHTML={{ __html: filmData.description }} />
        <h2>Starring:</h2>
        <ul>
          {filmData.starring.map(({ actor }) =>
            actor.map(({ remoteId, name }) => (
              <li>
                <Link key={remoteId} to={`/actor/${remoteId}`}>{name}</Link>
              </li>
            ))
          )}
        </ul>
      </article>
    </Layout>
  )
}

export const query = graphql`
fragment FilmPage on DgraphFilm {
      remoteId
      name
      description
      initial_release_date
      starring {
        actor {
          remoteId
          name
        }
      }
      sequel {
          name
        }
      prequel {
        name
      }
    }
  query RootDoc($name: String!) {
    dgraphFilm(name: { eq: $name }) {
      ...FilmPage
  }
  }
`

export const collectionQuery = unstable_collectionGraphql`
{
  allDgraphFilm {
    ...CollectionPagesQueryFragment
  }
}`