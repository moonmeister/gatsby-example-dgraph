const fs = require("fs-extra")
const fetch = require("node-fetch")
const path = require("path")
const { print } = require("gatsby/graphql")
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
const debugDir = __dirname + "../../.cache/dgraph-graphql-documents"
const gatsbyTypePrefix = `Dgraph_`

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

async function getGatsbyNodeTypes() {
  if (gatsbyNodeTypes) {
    return gatsbyNodeTypes
  }
  // const schema = await getSchema()
  // const fromIface = (ifaceName, doc) => {
  //   const iface = schema.getType(ifaceName)
  //   return schema.getPossibleTypes(iface).map(type => ({
  //     remoteTypeName: type.name,
  //     queries: doc(type.name),
  //   }))
  // }
  // prettier-ignore
  return (gatsbyNodeTypes = [
    {
      remoteTypeName: `Task`,
      queries: `
        query LIST_TASKS {
          queryTask(first: $limit, offset: $offset) { ..._TaskId_ }
        }
        fragment _TaskId_ on Task { __typename id }
      `,
    },
    {
      remoteTypeName: `User`,
      queries: `
        query LIST_USERS {
          queryUser(first: $limit, offset: $offset) { ..._UserId_ }
        }
        fragment _UserId_ on User { __typename id }
      `,
    },
  ]
  )
}

async function writeDefaultFragments(pluginOptions) {
  const defaultFragments = generateDefaultFragments({
    schema: await getSchema(pluginOptions),
    gatsbyNodeTypes: await getGatsbyNodeTypes(),
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
  const gatsbyNodeTypes = await getGatsbyNodeTypes()

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
    execute: wrapQueryExecutorWithQueue(createExecute(pluginOptions), { concurrency: 10 }),
    verbose: true,
  })
}

function createExecute(pluginOptions) {
  const { endpoint, token } = pluginOptions

  return async function execute({ operationName, query, variables = {} }) {
    // console.log(operationName, variables)
    const body = JSON.stringify(query, null, 2)
    console.log(body)
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ query, variables, operationName }),
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": `${token}`,
      },
    })
    const resp = await res.json()
    console.log("response:", JSON.stringify(resp, null, 2))
    return resp
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

  const { cache } = gatsbyApi
  const config = await getSourcingConfig(gatsbyApi, pluginOptions)
  const cached = (await cache.get(`DGRAPH_SOURCED`)) || false

  if (cached) {
    // Applying changes since the last sourcing
    // const nodeEvents = [
    //   {
    //     eventName: "DELETE",
    //     remoteTypeName: "blog_blog_Entry",
    //     remoteId: { __typename: "blog_blog_Entry", id: "422" },
    //   },
    //   {
    //     eventName: "UPDATE",
    //     remoteTypeName: "blog_blog_Entry",
    //     remoteId: { __typename: "blog_blog_Entry", id: "421" },
    //   },
    //   {
    //     eventName: "UPDATE",
    //     remoteTypeName: "blog_blog_Entry",
    //     remoteId: { __typename: "blog_blog_Entry", id: "18267" },
    //   },
    //   {
    //     eventName: "UPDATE",
    //     remoteTypeName: "blog_blog_Entry",
    //     remoteId: { __typename: "blog_blog_Entry", id: "11807" },
    //   },
    // ]
    console.log(`Sourcing delta!`)
    // await sourceNodeChanges(config, { nodeEvents })
    // return
  }

  await sourceAllNodes(config)
  await cache.set(`DGRAPH_SOURCED`, true)
}