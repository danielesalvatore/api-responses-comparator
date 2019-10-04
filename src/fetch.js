const U = require('./utils')

const init = async () => {
  const {MASTER_API_BASE_URL} = process.env

  // If no MASTER_API_BASE_URL throw error
  if (!MASTER_API_BASE_URL) {
    throw new Error(`Error: MASTER_API_BASE_URL not provided! Include it in .env`)
  }

  const urls = await U.loadCSV()

  const u = async ({url}, index) => {
    url = `${MASTER_API_BASE_URL}${url}`
    const content = await U.fetch({url})
    await U.writeToFile({
      file: U.createFilePath({file: index}),
      content,
    })
  }

  urls.forEach(u)
}

init()
