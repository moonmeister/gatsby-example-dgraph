import * as React from "react"

import { useForm, usePlugin } from 'tinacms'

import Layout from "../components/Layout"

export default function HomePage() {

  const formConfig = {
    id: 'dgraph-tina-index',
    label: 'Edit Page',
    fields: [
      {
        name: 'title',
        label: 'Title',
        component: 'text',
      },
      {
        name: 'body',
        label: 'Body',
        component: 'html',
      }
    ],
    initialValues: {
      title: 'The Film Database',
      body: 'Enjoy!'
    },
    onSubmit: async () => {
      window.alert('Saved!');
    },
  }

  const [modifiedValues, form] = useForm(formConfig)
  usePlugin(form)

  return (
    <Layout enableEditing explain={"This page may be edited but content is stored in state so changes are lost on refresh."}>
      <h1>{modifiedValues.title}</h1>

      <div dangerouslySetInnerHTML={{ __html: modifiedValues.body }} />
    </Layout>
  )
}