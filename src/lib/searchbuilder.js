// Constants
const CH_SPACE = ' '
const JOIN_OR = ' OR '

// Removes unnecessary quotes from around a string
// Then adds quotes if the string contains spaces
// Suitable for use in Array.map() functions
function fixQuotes (str) {
  str = str.replace(/^"?(.*?)"?$/, '$1')
  return str.indexOf(CH_SPACE) > -1
    ? `"${str}"`
    : str
}

// Takes a query and splits it into a space-delimited array, preserving quotes
function splitQuery (query) {
  return query.match(/(".*?"|[^ ]+)/g).map(fixQuotes)
}

function makeTagSearch (terms) {
  return terms.map(term => `tags=${term}`).join(JOIN_OR)
}

function makeFilenameSearch (terms) {
  return terms.map(term => `filename:${term}`).join(JOIN_OR)
}

// Takes a search query and creates a
function createExpression (query) {
  const terms = splitQuery(query)

  // Search tags and filenames
  const tagSearch = makeTagSearch(terms)
  const filenameSearch = makeFilenameSearch(terms)

  const expression = tagSearch + JOIN_OR + filenameSearch
  return expression
}

export default {
  createExpression
}
