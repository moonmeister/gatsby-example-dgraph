import * as React from "react"
import Layout from "../../components/Layout"


export default function ActorPage({ params }) {

  return (
    <Layout enableEditing={true} explain={"This page is a client side route. Tina CMS reads and writes data from the database directly. It may be edited and previewed here but no deploy/build are requred because data is fetched on load."}>
      {
        <pre>{JSON.stringify(params, null, 2)}</pre>
      }
    </Layout>

  )
}