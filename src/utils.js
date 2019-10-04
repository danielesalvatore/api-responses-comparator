const path = require('path')
const fs = require('fs')
const csv = require('csvtojson')
const axios = require('axios')

// Env file configuration
require('dotenv').config()

module.exports.fetch = async ({url}) => {
  const {TOKEN} = process.env

  try {
    // Add request headers
    const headers = {
      'Content-Type': 'application/json',
    }
    if (!!TOKEN) {
      headers.Authorization = `${TOKEN}`
    }
    const response = await axios.get(url, {
      headers,
    })

    return response.data
  } catch (err) {
    console.error(err.message)
    throw new Error(`Impossible to fetch response for ${url}`)
  }
}

module.exports.createFilePath = ({file}) => {
  const {OUTPUT_FOLDER} = process.env

  const OUTPUT_PATH = path.resolve(OUTPUT_FOLDER)

  const OUTPUT = `${OUTPUT_PATH}/${file}`

  return OUTPUT
}

module.exports.writeToFile = ({file, content}) => {
  fs.writeFileSync(file, JSON.stringify(content))
}

module.exports.loadFileContent = ({file}) => {
  const INPUT_PATH = path.resolve(file)

  // Check if file exists
  if (!fs.existsSync(INPUT_PATH)) {
    throw new Error(`Impossible to load file ${file}`)
  }

  const content = fs.readFileSync(INPUT_PATH, 'UTF8')

  return JSON.parse(content)
}

module.exports.loadCSV = async () => {
  const {URLS_FILE} = process.env
  const INPUT_PATH = path.resolve(URLS_FILE)

  // Check if file exists
  if (!fs.existsSync(INPUT_PATH)) {
    throw new Error('Please specify an existing URLS_FILE in .env file')
  }

  const jsonArray = await csv().fromFile(INPUT_PATH)

  return jsonArray
}
