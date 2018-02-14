// For managing all window.location paths

const ROUTE_SEP = '/'
const ROUTE_REGEX = /^\/(.+?)\/?$/

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

// Gets the first n parts of a route
function getRoute (route) {
  return ROUTE_SEP + splitRoute(route).join(ROUTE_SEP)
}

// Gets the first n parts of a route
function getPartialRoute (route, n) {
  return ROUTE_SEP + splitRoute(route).slice(0, n).join(ROUTE_SEP)
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
  getRoute,
  getPartialRoute,
  getAPIPath,
  APIToRoute,
  matches,
  goBackTo
}
