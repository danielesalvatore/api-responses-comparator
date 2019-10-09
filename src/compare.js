const U = require('./utils')
const diff = require('deep-diff')
const chalk = require('chalk')

const init = async () => {
  const {
    SECONDARY_API_BASE_URL,
    SECONDARY_API_AUTHORIZATION_TOKEN,
    SECONDARY_API_AWS_API_KEY,
    SECONDARY_API_CONTENT_TYPE_HEADER,
    SECONDARY_API_ACCEPT_HEADER,
  } = process.env

  const urls = await U.loadCSV()
  let foundWithDifferences = 0
  let foundAllRight = 0

  if (!SECONDARY_API_BASE_URL) {
    throw new Error(`Error: SECONDARY_API_BASE_URL not provided! Include it in .env`)
  }

  const u = async ({url}) => {
    const file = U.createOutputFilePath({file: url})

    const liveContent = await U.fetch({
      url: `${SECONDARY_API_BASE_URL}${url}`,
      authorizationToken: SECONDARY_API_AUTHORIZATION_TOKEN,
      awsApiKey: SECONDARY_API_AWS_API_KEY,
      contentType: SECONDARY_API_CONTENT_TYPE_HEADER,
      accept: SECONDARY_API_ACCEPT_HEADER,
    })
    const localContent = U.loadFileContent({file})
    const differences = diff(liveContent, localContent)
    if (differences) {
      const differencesFile = U.createDifferencesFilePath({file: url})

      await U.writeToFile({
        file: differencesFile,
        content: differences,
      })

      console.log(chalk.red(`Found differences for: ${url}`))
      foundWithDifferences++
    } else {
      console.log(chalk.green(`All right for: ${url}`))
      foundAllRight++
    }
  }

  await Promise.all(urls.map(u))

  // Print stats

  console.log(
    `

    API with differences: ${chalk.red(foundWithDifferences)}
    API all right: ${chalk.green(foundAllRight)}
    Total API: ${chalk.blue(foundWithDifferences + foundAllRight)}
    
    `,
  )
}

init()
