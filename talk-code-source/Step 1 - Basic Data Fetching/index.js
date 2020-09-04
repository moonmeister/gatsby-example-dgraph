import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../../components/Layout"

export default function FilmPage({ data }) {
  const { allDgraphFilm: { nodes: allFilms } } = data


  return (
    <Layout explain={"This page may not be edited. This is static data fetched at build time."}>
      <h1>Films</h1>
      <ul>
        {
          allFilms.map(({ name, remoteId }) => {
            return (
              <li key={remoteId}>
                <h2>{name}</h2>
              </li>
            )
          })
        }
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query ListFilms {
    allDgraphFilm(sort: {order: ASC, fields: name}) {
      nodes {
        remoteId
        name
      }
    }
  }
`