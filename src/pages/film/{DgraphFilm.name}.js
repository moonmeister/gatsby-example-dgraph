import * as React from "react"
import { graphql, unstable_collectionGraphql, Link } from "gatsby"
import { useForm, usePlugin, useCMS } from 'tinacms'

import Layout from "../../components/Layout"
import { triggerRefresh } from "../../lib/webhook"
import { graphqlCRUD } from "../../lib/graphql"

export default function FilmPage({ data }) {
  const { dgraphFilm: film } = data
  const cms = useCMS()

  const formConfig = {
    id: 'dgraph-tina-film',
    label: 'Edit Film',
    fields: [
      {
        name: 'name',
        label: 'Name',
        component: 'text',
      },
      {
        name: 'description',
        label: 'Summary',
        component: 'html'
      }
    ],
    initialValues: film,
    onSubmit: async (formData) => {
      cms.alerts.info('Saving Content...')
      try {
        const data = await graphqlCRUD({
          query: `
          mutation updateFilm($patch: UpdateFilmInput!) {
            updateFilm(input: $patch) {
              film {
                id                  
              }
            }
          }
          `, variables: {
            patch: {
              filter: { id: [film.remoteId] },
              set: {
                name: formData.name,
                description: formData.description,
              },
            }
          }, operationName: `updateFilm`
        })

        if (data?.errors) {
          console.error(data.errors)
          cms.alerts.error("Error saving Content!")

          return
        } else {
          cms.alerts.success('Saved Content!');
        }

        await triggerRefresh([{ remoteTypeName: 'Film', eventName: "UPDATE", remoteId: { id: film.remoteId } }])

      } catch (err) {
        console.error(err)
      }
    },
  }

  const [filmData, form] = useForm(formConfig)
  usePlugin(form)
  return (
    <Layout enableEditing={true}>
      <article>
        <h1>{filmData.name}</h1>
        <div dangerouslySetInnerHTML={{ __html: filmData.description }} />
        <h2>Starring:</h2>
        <ul>
          {filmData.starring.map(({ actor }) =>
            actor.map(({ id, name }) => (
              <li>
                <Link key={id} to={`/actor/${id}`}>{name}</Link>
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
          id
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