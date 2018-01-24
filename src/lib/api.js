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

// Handle API responses
function respond (url) {
  return new Promise((resolve, reject) => {
    request(url).then(resp => {
      const json = JSON.parse(resp)
      if (json.hasOwnProperty('http_code') && json.http_code !== 200) {
        reject(json)
      } else {
        resolve(json)
      }
    }).catch(err => {
      reject(JSON.parse(err))
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
function getFiles (path) {
  const url = URL('/files', { path })
  return respond(url)
}

export default {
  getFolders,
  getFiles
}
