const GRAPHQL_ENDPOINT = process.env.GATSBY_SLASH_GRPAHQL_ENDPOINT

export async function graphqlCRUD(body) {
  if (!body || !Object.isObject(body)) {
    throw Error("Invalid body, must have body and must be object")
  }

  const resp = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })

  return resp.json()
}