
const PREVIEW_WEBHOOK = process.env.GATSBY_PREVIEW_WEBHOOK
const BUILD_WEBHOOK = process.env.GATSBY_BUILD_WEBHOOK


export async function triggerRefresh(body = {}) {
  const gatsbyPreview = fetch(PREVIEW_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    }
  })

  if (BUILD_WEBHOOK === PREVIEW_WEBHOOK) {
    return
  }

  const gatsbyBuild = fetch(PREVIEW_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    }
  })

  return Promise.allSettled([gatsbyPreview, gatsbyBuild])
}