const U = require('./utils')
const diff = require('deep-diff')

const init = async () => {
  const urls = await U.loadCSV()
  // If no SECONDARY_API_BASE_URL throw error
  if (!SECONDARY_API_BASE_URL) {
    throw new Error(`Error: SECONDARY_API_BASE_URL not provided! Include it in .env`)
  }

  const u = async ({url}, index) => {
    url = `${SECONDARY_API_BASE_URL}${url}`
    const file = U.createFilePath({file: `${SECONDARY_API_BASE_URL}`})

    const liveContent = await U.fetch({url})
    const localContent = U.loadFileContent({file})

    if (JSON.stringify(liveContent) != JSON.stringify(localContent)) {
      const differences = diff(liveContent, localContent)
      console.log(differences)
      throw new Error(`Error on ${url}`)
    } else {
      console.log(`OK on ${url}`)
    }
  }

  urls.forEach(u)
}

init()
