import * as React from "react"
import { graphql, Link } from "gatsby"
import slugify from "slugify"
import Layout from "../../components/Layout"

export default function FilmPage({ data }) {
  const { allDgraphFilm: { nodes: allFilms } } = data

  return (
    <Layout enableEditing={false}>
      <h1>Films</h1>
      {/* <pre>{JSON.stringify(allFilms, null, 2)}</pre> */}
      <ul>
        {
          allFilms.map(film => (
            <li key={film.remoteId}>
              <article >
                <Link to={`/film/${slugify(film?.name).toLowerCase()}`}><h2>{film?.name}</h2></Link>
              </article>
            </li>
          ))
        }
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query ListFilms {
    allDgraphFilm {
      nodes {
        name
        remoteId
      }
    }
  }
`