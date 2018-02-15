// For managing all window.location paths

const ROUTE_SEP = '/'
const ROUTE_REGEX = /^\/?(.+?)\/?$/
const PUBLIC_ID_REGEX = /^(.*?)\/[^/]+$/

/**
 * splitRoute - Splits a route to array format.
 *
 * @param  {string|string[]} route
 *   The route to standardise.
 * @return {string[]}
 *   The route as an array.
 */
function splitRoute (route) {
  // Route is already an array
  if (typeof route === 'object') { return route }

  // Route is too short to split
  if (route === '' || route === ROUTE_SEP) { return [] }

  // Trim, split and return
  const trimmed = route.match(ROUTE_REGEX)[1]
  return trimmed.split(ROUTE_SEP)
}

function getRouteBase (route) {
  const split = splitRoute(route)
  return split.length > 0
    ? split[0]
    : undefined
}

// Gets the first n parts of a route
function getRoute (route) {
  return ROUTE_SEP + splitRoute(route).join(ROUTE_SEP)
}

// Gets the first n parts of a route
function getPartialRoute (route, n) {
  return ROUTE_SEP + splitRoute(route).slice(0, n).join(ROUTE_SEP)
}

// Converts a resource's public_id to a folder path
function getRouteFromPublicId (publicId) {
  return APIToRoute(getAPIPathFromPublicId(publicId))
}

// Converts a resource's public_id to a folder path
function getAPIPathFromPublicId (publicId) {
  return (publicId.indexOf('/') > -1)
    ? publicId.match(PUBLIC_ID_REGEX)[1]
    : ''
}

// Converts app route array to API path
function getAPIPath (route) {
  const arr = splitRoute(route)
  if (arr.length === 1) { return '' }
  return arr.slice(1).join(ROUTE_SEP)
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

function goBackTo (target, location, history) {
  (
    location.state &&
    location.state.canGoBack
  )
    ? history.goBack(false)
    : history.push(target)
}

export default {
  splitRoute,
  getRouteBase,
  getRoute,
  getPartialRoute,
  getAPIPath,
  getRouteFromPublicId,
  getAPIPathFromPublicId,
  APIToRoute,
  matches,
  goBackTo
}
