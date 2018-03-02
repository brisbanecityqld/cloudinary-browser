import GA from 'react-ga'

const CATEGORIES = {
  USER: 'User',
  CONTENT: 'Cloudinary content'
}

const ACTIONS = {
  ADD_FAVOURITE: 'Favourited folder',
  REMOVE_FAVOURITE: 'Unfavourited folder',
  REFRESH_FOLDER: 'Refreshed folder',
  REFRESH_SEARCH: 'Refreshed search',
  CHANGE_VIEWMODE: 'Changed viewmode',
  DOWNLOAD_RESOURCE: 'Downloaded resource',
  DOWNLOAD_ZIP: 'Downloaded .zip'
}

const DIMENSIONS = {
  VIEWMODE: 'dimension1'
}

/**
 * INIT
 */

function init(key, debug) {
  if (debug) {
    GA.initialize(key, { debug }, 'none')
  } else {
    GA.initialize(key)
  }
}

/**
 * PAGE VIEWS
 */

// Sends a pageview, and optionally sets the viewmode (e.g. if at /browse/*)
function visitedPage (path, title, viewmode = undefined) {
  GA.set({
    page: path,
    [DIMENSIONS.VIEWMODE]: viewmode
  })
  GA.pageview (path, [], title)
}

/**
 * EVENT TRACKING
 */

// Marks that a user favourited a folder
function userFavouritedFolder (path) {
  GA.event({ category: CATEGORIES.USER, action: ACTIONS.ADD_FAVOURITE, label: '/' + path })
}

// Marks that a user unfavourited a folder
function userUnfavouritedFolder (path) {
  GA.event({ category: CATEGORIES.USER, action: ACTIONS.REMOVE_FAVOURITE, label: '/' + path })
}

// User force-refreshed a folder
function userRefreshedFolder (path) {
  GA.event({ category: CATEGORIES.USER, action: ACTIONS.REFRESH_FOLDER, label: '/' + path })
}

// User force-refreshed a search
function userRefreshedSearch (term) {
  GA.event({ category: CATEGORIES.USER, action: ACTIONS.REFRESH_SEARCH, label: term })
}

// User changed the viewmode
function userChangedViewmode (mode) {
  GA.event({ category: CATEGORIES.USER, action: ACTIONS.CHANGE_VIEWMODE, label: mode})
}

// Track downloads
function userDownloadedResource (publicId) {
  GA.event({ category: CATEGORIES.USER, action: ACTIONS.DOWNLOAD_RESOURCE, label: '/' + publicId })
}

// Track .zip downloads
function userDownloadedZip (publicIds) {
  GA.event({
    category: CATEGORIES.USER,
    action: ACTIONS.DOWNLOAD_ZIP,
    label: publicIds.map(pid => '/' + pid).join(',')
  })
}

/**
 * TIMING
 */

let timer = 0
function startTimer () {
  timer = Date.now()
}
function recordTiming (label) {
  const elapsed = Date.now() - timer
  GA.timing({ category: CATEGORIES.CONTENT, variable: 'load', label, value: elapsed })
}

export default {
  init,
  visitedPage,
  userFavouritedFolder,
  userUnfavouritedFolder,
  userRefreshedFolder,
  userRefreshedSearch,
  userChangedViewmode,
  userDownloadedResource,
  userDownloadedZip,

  startTimer,
  recordTiming
}
