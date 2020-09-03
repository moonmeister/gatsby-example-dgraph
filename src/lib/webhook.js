
const BUILD_WEBHOOK = process.env.GATSBY_BUILD_WEBHOOK

export async function triggerRefresh(body = {}) {
  return fetch(BUILD_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    }
  })

}