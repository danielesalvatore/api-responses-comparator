const U = require('./utils')
const diff = require('deep-diff')
const chalk = require('chalk')

const init = async () => {
  const {SECONDARY_API_BASE_URL, SECONDARY_API_AUTHORIZATION_TOKEN} = process.env

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
    })
    const localContent = U.loadFileContent({file})

    if (JSON.stringify(liveContent) != JSON.stringify(localContent)) {
      const differences = diff(liveContent, localContent)
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
