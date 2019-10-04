const path = require('path')
const fs = require('fs')
const csv = require('csvtojson')
const axios = require('axios')

// Env file configuration
require('dotenv').config()

module.exports.fetch = async ({url, authorizationToken}) => {
  try {
    // Add request headers
    const headers = {
      //'Content-Type': 'application/json',
      //Accept: 'application/json, text/javascript, */*; q=0.01',
    }
    if (!!authorizationToken) {
      headers.Authorization = authorizationToken
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

const sanitize = name => name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
module.exports.sanitizeFileName = sanitize

module.exports.createOutputFilePath = ({file}) => {
  const {RESPONSES_OUTPUT_FOLDER} = process.env

  const OUTPUT_PATH = path.resolve(RESPONSES_OUTPUT_FOLDER)
  const safeFileName = sanitize(file)

  const OUTPUT = `${OUTPUT_PATH}/${safeFileName}`

  return OUTPUT
}

module.exports.createDifferencesFilePath = ({file}) => {
  const {DIFFERENCES_OUTPUT_FOLDER} = process.env

  const OUTPUT_PATH = path.resolve(DIFFERENCES_OUTPUT_FOLDER)
  const safeFileName = sanitize(file)

  const OUTPUT = `${OUTPUT_PATH}/${safeFileName}`

  return OUTPUT
}

module.exports.writeToFile = ({file, content}) => {
  fs.writeFileSync(file, JSON.stringify(content, null, 4))
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
