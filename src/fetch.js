const U = require('./utils')

const init = async () => {
  const {
    MASTER_API_BASE_URL,
    MASTER_API_AUTHORIZATION_TOKEN,
    MASTER_API_AWS_API_KEY,
    MASTER_API_CONTENT_TYPE_HEADER,
    MASTER_API_ACCEPT_HEADER,
  } = process.env

  if (!MASTER_API_BASE_URL) {
    throw new Error(`Error: MASTER_API_BASE_URL not provided! Include it in .env`)
  }

  const urls = await U.loadCSV()

  const u = async ({url}) => {
    const content = await U.fetch({
      url: `${MASTER_API_BASE_URL}${url}`,
      authorizationToken: MASTER_API_AUTHORIZATION_TOKEN,
      awsApiKey: MASTER_API_AWS_API_KEY,
      contentType: MASTER_API_CONTENT_TYPE_HEADER,
      accept: MASTER_API_ACCEPT_HEADER,
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
