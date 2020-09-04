import * as React from "react"
import Layout from "../../components/Layout"
import { useForm, usePlugin } from 'tinacms'

import { graphqlCRUD } from "../../lib/graphql"

export default function ActorPage({ params }) {
  const { id } = params

  const formConfig = {
    id: 'dgraph-tina-actor',
    label: 'Edit Actor',
    fields: [
      {
        name: 'name',
        label: 'Name',
        component: 'text',
      },
    ],
    loadInitialValues: async () => {
      try {
        const { data: { getActor } } = await graphqlCRUD({
          query: `query fetchActor($id: ID!) {
              getActor(id: $id) {
                name
              performances {
                character {
                  id
                  name
                }
              }
            }
          }`,
          variables: {
            id
          },
          operationName: `fetchActor`
        })

        return getActor
      } catch (err) {
        console.error(err)
        return { error: err.message }
      }

    },
  }

  const [actorData, form] = useForm(formConfig)
  usePlugin(form)

  return (
    <Layout enableEditing={true} explain={"This page is a client side route. Tina CMS reads and writes data from the database directly. It may be edited and previewed here but no deploy/build are requred because data is fetched on load."}>
      {
        actorData?.name ?
          <article>
            <h1>{actorData.name}</h1>
            <h2>Characters Played</h2>
            <ul>
              {actorData.performances.map(perf => perf.character.map(character => (<li>{character.name}</li>)))}
            </ul>
          </article>
          : actorData?.error ? <div>Error fetching data: {JSON.stringify(actorData, null, 2)} </div> :
            <h1>Loading page...</h1>
      }
    </Layout>
  )
}