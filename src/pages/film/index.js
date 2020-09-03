import * as React from "react"
import { graphql, Link } from "gatsby"
import slugify from "slugify"
import Layout from "../../components/Layout"

export default function FilmPage({ data }) {
  const { allDgraphFilm: { nodes: allFilms } } = data

  return (
    <Layout explain={"This page may not be edited. This is static data fetched at build time."}>
      <h1>Films</h1>
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
    allDgraphFilm(sort: {order: ASC, fields: name}) {
      nodes {
        name
        remoteId
      }
    }
  }
`