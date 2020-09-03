// import * as React from "react"
// import { useRemarkForm } from 'gatsby-tinacms-remark'
// import { usePlugin } from 'tinacms'
// import { useStaticQuery } from 'gatsby'

// const Title = (title) => {
//   // 2. Add required GraphQL fragment
//   // const data = useStaticQuery(graphql`
//   //   query TitleQuery {
//   //     markdownRemark(fields: { slug: { eq: "song-of-myself" } }) {
//   //       ...TinaRemark
//   //       frontmatter {
//   //         title
//   //       }
//   //     }
//   //   }
//   // `)

//   // 3. Call the hook and pass in the data
//   const [markdownRemark, form] = useRemarkForm(data.markdownRemark)

//   // 4. Register the form plugin
//   usePlugin(form)

//   return <h1>{markdownRemark.frontmatter.title}</h1>
// }

// export default Title