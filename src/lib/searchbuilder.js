// Constants
const CH_QUOTE = '"'
const CH_MINUS = '-'
const CH_COMMA = ','
const JOIN_OR = ' OR '
const JOIN_AND = ' AND '

// Takes a query and splits it into a space-delimited array, preserving quotes
function splitQuery (query) {
  return query.match(/([-]?".*?"|[^ ]+)/g)
}

// Gets the correct separator for a tag
function getSep (tag) {
  return tag.indexOf(CH_QUOTE) > -1 ? '=' : ':'
}

function makeTagSearch (terms) {
  const arrPositives = terms.filter(t => t[0] !== CH_MINUS)
  const arrNegatives = terms.filter(t => t[0] === CH_MINUS)

  const positives = arrPositives.map(t => `tags${getSep(t)}${t}`).join(JOIN_AND)
  const negatives = arrNegatives.map(t => t.slice(1)).join(CH_COMMA)

  let out = ''
  if (positives) {
    out += positives
  }
  if (negatives) {
    out += (out !== '' ? JOIN_AND : '') + `-tags:${negatives}`
  }

  return out
}

function makeFilenameSearch (terms) {
  // return terms.map(term => `filename${term.indexOf(CH_QUOTE) > -1 ? '=' : ':'}${term}`).join(JOIN_AND)
  const term = terms[0]
  const sep = getSep(term)
  return terms.length > 1
    ? ''
    : term.charAt(0) === CH_MINUS
    ? `-filename${sep}${term.slice(1)}`
    : `filename${sep}${term}`
}

// Takes a search query and creates a
function createExpression (query) {
  if (query.length === 0) return ''

  const terms = splitQuery(query.toLowerCase())

  // Search tags and filenames
  const tagSearch = makeTagSearch(terms)
  const filenameSearch = makeFilenameSearch(terms)

  const expression = terms.length === 1
    ? tagSearch + JOIN_OR + filenameSearch
    : tagSearch

  // console.log(expression)
  return expression
}

export default {
  createExpression
}
