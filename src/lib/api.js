// Abstracted file browser API

import request from 'request-promise-native'

const SERVER_URL = 'localhost'
const SERVER_PORT = 8000

// Create API URL from endpoint and params object
function URL (endpoint, params = null) {
  let qs = ''
  if (params !== null) { qs = QS(params) }
  return `http://${SERVER_URL}:${SERVER_PORT}${endpoint}${qs}`
}

// Create query string from params object
const QS = params => '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')

const parseJSON = data => {
  // Handle already-parsed data
  if (typeof data === 'object') {
    return data
  }

  // Parse JSON, or fail as custom error
  try {
    return JSON.parse(data)
  } catch (e) {
    return { message: data }
  }
}

// Handle API responses
function respond (url) {
  return new Promise((resolve, reject) => {
    request(url).then(resp => {
      const json = parseJSON(resp)
      if (json.hasOwnProperty('http_code') && json.http_code !== 200) {
        reject(json)
      } else {
        resolve(json)
      }
    }).catch(err => {
      reject(parseJSON(err))
    })
  })
}

// ENDPOINTS

// Endpoint: list all folders in a directory
function getFolders (path) {
  const url = URL('/folders', { path })
  return respond(url)
}

// Endpoint: list all files in a directory
function getResources (path, nextCursor = null) {
  const max_results = 50
  const options = { path, max_results }
  if (nextCursor) {
    options.next_cursor = nextCursor
  }

  const url = URL('/resources', options)
  return respond(url)
}

export default {
  getFolders,
  getResources
}
