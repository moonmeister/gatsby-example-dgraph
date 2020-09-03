import * as React from "react"
import Layout from "../../components/Layout"
import { useForm, usePlugin, useCMS } from 'tinacms'

import { graphqlCRUD } from "../../lib/graphql"

export default function ActorPage({ params }) {
  const { id } = params
  const cms = useCMS()

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
      console.debug("Loading inital values")

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
    onSubmit: async (formData) => {
      cms.alerts.info('Saving Content...')
      try {

        const data = await graphqlCRUD({
          query: `
            mutation updateActor($patch: UpdateActorInput!) {
              updateActor(input: $patch) {
                actor {
                  id
                }
              }
            }
            `, variables: {
            patch: {
              filter: { id: [id] },
              set: {
                name: formData.name
              },
            }
          }, operationName: `updateActor`
        })

        if (data?.errors) {
          console.error(data.errors[0].message)
          cms.alerts.error(data.errors[0].message)
        } else {
          cms.alerts.success('Saved Content!');
        }
      } catch (err) {
        console.error(err)
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