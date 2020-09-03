const fs = require("fs-extra")
const fetch = require("node-fetch")
const path = require("path")
const { print, isObjectType } = require("gatsby/graphql")
const {
  sourceAllNodes,
  sourceNodeChanges,
  createSchemaCustomization,
  generateDefaultFragments,
  compileNodeQueries,
  buildNodeDefinitions,
  wrapQueryExecutorWithQueue,
  loadSchema,
} = require("gatsby-graphql-source-toolkit")

const fragmentsDir = __dirname + "/dgraph-fragments"
const debugDir = __dirname + "/dgraph-graphql-debug"
const gatsbyTypePrefix = `Dgraph`

let schema
let gatsbyNodeTypes
let sourcingConfig

// 1. Gatsby field aliases
// 2. Node ID transforms?
// 3. Pagination strategies?
// 4. Schema customization field transforms?
// 5. Query variable provider?

async function getSchema(pluginOptions) {
  if (!schema) {
    schema = await loadSchema(createExecute(pluginOptions))

    // schema = buildASTSchema(
    //   parse(fs.readFileSync(__dirname + "/schema.graphql").toString())
    // )
  }
  return schema
}

async function getGatsbyNodeTypes(schema, { include, limit }) {
  if (gatsbyNodeTypes) {
    return gatsbyNodeTypes
  }

  const queryType = schema.getQueryType()
  const queryFields = queryType.getFields()
  const types = Object.keys(queryFields).map(field => queryFields[field].type).filter(type => isObjectType(type)).filter(type => include.includes(type.name))

  return gatsbyNodeTypes = types.map((type) => ({
    remoteTypeName: type.name,
    queries: `
      query LIST_${type.name} {
        #  query${type.name}(first: $limit, offset: $offset) {
          query${type.name}(first: ${limit}) {
          ..._${type.name}Id_
        }
      }

      query NODE_${type.name} {
        get${type.name}(id: $id) { ..._${type.name}Id_ }
      }

      fragment _${type.name}Id_ on ${type.name} { id }
    `,
  }))

}

async function writeDefaultFragments(pluginOptions) {
  const schema = await getSchema(pluginOptions)

  const defaultFragments = generateDefaultFragments({
    schema,
    gatsbyNodeTypes: await getGatsbyNodeTypes(schema, pluginOptions),
  })
  for (const [remoteTypeName, fragment] of defaultFragments) {
    const filePath = path.join(fragmentsDir, `${remoteTypeName}.graphql`)
    if (!fs.existsSync(filePath)) {
      await fs.writeFile(filePath, fragment)
    }
  }
}

async function collectFragments() {
  const customFragments = []
  for (const fileName of await fs.readdir(fragmentsDir)) {
    if (/.graphql$/.test(fileName)) {
      const filePath = path.join(fragmentsDir, fileName)
      const fragment = await fs.readFile(filePath)
      customFragments.push(fragment.toString())
    }
  }
  return customFragments
}

async function writeCompiledQueries(nodeDocs) {
  await fs.ensureDir(debugDir)
  for (const [remoteTypeName, document] of nodeDocs) {
    await fs.writeFile(debugDir + `/${remoteTypeName}.graphql`, print(document))
  }
}

async function getSourcingConfig(gatsbyApi, pluginOptions) {
  if (sourcingConfig) {
    return sourcingConfig
  }

  const schema = await getSchema(pluginOptions)
  const gatsbyNodeTypes = await getGatsbyNodeTypes(schema, pluginOptions)

  const documents = await compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: await collectFragments(),
  })

  await writeCompiledQueries(documents)

  return (sourcingConfig = {
    gatsbyApi,
    schema,
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
    gatsbyTypePrefix,
    execute: wrapQueryExecutorWithQueue(createExecute(pluginOptions), { concurrency: 1 }),
    verbose: true,
  })
}

function createExecute(pluginOptions) {
  const { endpoint, token } = pluginOptions

  return async function execute({ operationName, query, variables = {} }) {
    // console.log('query: ', JSON.stringify(query, null, 2))

    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ query, variables, operationName }),
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": `${token}`,
      },
    })
    const data = await res.json()
    // console.log("response:", JSON.stringify(data, null, 2))

    if (data && data.errors) {
      throw new Error(JSON.stringify(data.errors, null, 2))
    }

    return data
  }
}



exports.onPreBootstrap = async (gatsbyApi, pluginOptions) => {
  await writeDefaultFragments(pluginOptions)
}

exports.createSchemaCustomization = async (gatsbyApi, pluginOptions) => {

  const config = await getSourcingConfig(gatsbyApi, pluginOptions)
  await createSchemaCustomization(config)
}

exports.sourceNodes = async (gatsbyApi, pluginOptions) => {

  const { cache, webhookBody } = gatsbyApi
  const config = await getSourcingConfig(gatsbyApi, pluginOptions)
  const cached = (await cache.get(`DGRAPH_SOURCED`)) || false

  if (cached && Array.isArray(webhookBody)) {
    console.log(`Sourcing delta!`, JSON.stringify(webhookBody, null, 2))
    await sourceNodeChanges(config, { nodeEvents: webhookBody })
    return
  } else if (cached) {
    console.log(`loading from cache`)
  }

  await sourceAllNodes(config)
  await cache.set(`DGRAPH_SOURCED`, true)
}