// Abstracted file browser API

import request from 'request-promise-native'

const SERVER_URL = window.location.hostname
const SERVER_PORT = 8000
const MAX_RESULTS = 50

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

// Endpoint: get a single resource
function getResource (public_id) {
  const url = URL('/resource', { public_id })
  return respond(url)
}

// Endpoint: list all files in a directory
function getResources (path, nextCursor = null) {
  const options = { path, max_results: MAX_RESULTS }
  if (nextCursor) {
    options.next_cursor = nextCursor
  }

  const url = URL('/resources', options)
  return respond(url)
}

// Endpoint: perform a search
function search (query, nextCursor = null) {
  const options = { q: query, max_results: MAX_RESULTS }
  if (nextCursor) {
    options.next_cursor = nextCursor
  }

  const url = URL('/search', options)
  return respond(url)
}

// Endpoint: get .zip of multiple public_ids
function downloadZip (publicIds = []) {
  if (!Array.isArray(publicIds) || publicIds.length < 2) return null

  // Limit to 1000 public_ids max
  const public_ids = encodeURIComponent(publicIds.slice(0, 1000).join(','))
  const url = URL('/download', { public_ids })
  return respond(url)
}

export default {
  getFolders,
  getResource,
  getResources,
  search,
  downloadZip
}
