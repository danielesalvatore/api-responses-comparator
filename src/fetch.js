const U = require('./utils')

const init = async () => {
  const {MASTER_API_BASE_URL, MASTER_API_AUTHORIZATION_TOKEN} = process.env

  if (!MASTER_API_BASE_URL) {
    throw new Error(`Error: MASTER_API_BASE_URL not provided! Include it in .env`)
  }

  const urls = await U.loadCSV()

  const u = async ({url}) => {
    const content = await U.fetch({
      url: `${MASTER_API_BASE_URL}${url}`,
      authorizationToken: MASTER_API_AUTHORIZATION_TOKEN,
    })

    const file = U.createOutputFilePath({file: url})

    await U.writeToFile({
      file,
      content,
    })
  }

  urls.forEach(u)
}

init()
