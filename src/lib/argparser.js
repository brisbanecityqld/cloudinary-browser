const ch_quote = '"'
const ch_space = ' '

export default function parse (str) {
  // Trim excess spaces
  str = str.trim().replace(/ +/g, ' ')

  // Balance quotes
  if (!str.split(ch_quote).length % 2) {
    const last = str.lastIndexOf(ch_quote)
    str = str.substr(0, last) + str.substr(last + 1)
  }

  let buffer = ''
  let terms = []
  let inQuotes = false

  function clearBuffer () {
    if (buffer !== '') {
      terms.push(buffer)
      buffer = ''
    }
  }

  for (let c of str) {
    switch (c) {
      case ch_quote: inQuotes = !inQuotes; clearBuffer(); break
      case ch_space: inQuotes ? buffer += c : clearBuffer(); break
      default: buffer += c; break
    }
  }
  clearBuffer()

  return terms.map(t => {
    t = t.trim()
    return (t.indexOf(ch_space) > -1)
      ? `"${t}"`
      : t
  })
}
