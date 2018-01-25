// For managing all window.location paths

const ROUTE_SEP = '/'

const BASE_REGEX = /^\/(\w+)/
const ROUTE_REGEX = /^\/(.+?)\/?$/

// Splits a given route into its parts
function splitRoute (route) {
  // Route is already an array
  if (typeof route === 'object') { return route }

  // Route is too short to split
  if (route === '' || route === ROUTE_SEP) { return [] }

  // Trim, split and return
  const trimmed = route.match(ROUTE_REGEX)[1]
  return trimmed.split(ROUTE_SEP)
}

// Gets the base component of a route
function getRouteBase (route) {
  return route.match(BASE_REGEX)[0]
}

// Gets the first n parts of a route
function getRoute (routeArray) {
  return ROUTE_SEP + routeArray.join(ROUTE_SEP)
}

// Gets the first n parts of a route
function getPartialRoute (routeArray, n) {
  return ROUTE_SEP + routeArray.slice(0, n).join(ROUTE_SEP)
}

// Converts app route array to API path
function getAPIPath (routeArray) {
  if (routeArray.length === 1) { return '' }
  return routeArray.slice(1).join(ROUTE_SEP)
}

// Converts an API-returned path to an app route
function APIToRoute (path) {
  return '/browse' + (path !== '' ? `/${path}` : '')
}

function matches (routeA, routeB) {
  const a = getRoute(splitRoute(routeA))
  const b = getRoute(splitRoute(routeB))
  return a === b
}

export default {
  splitRoute,
  getRouteBase,
  getRoute,
  getPartialRoute,
  getAPIPath,
  APIToRoute,
  matches
}
