exports.onClientEntry = () => {
  import('react-tinacms-editor').then(
    ({ HtmlFieldPlugin }) => {
      window.tinacms.fields.add(HtmlFieldPlugin)
      // window.tinacms.fields.add(MarkdownFieldPlugin)
    }
  )
}