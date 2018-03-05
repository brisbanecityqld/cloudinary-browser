// Simple backend for cloudinary-browser.
// Performs Cloudinary API requests and caches to a local DB.

const Express = require('express')
const Cloudinary = require('cloudinary')
const Crypto = require('crypto')

// Server settings
const PORT = 8000

// Set up Cloudinary
const CONFIG = require('./config')
Cloudinary.config(CONFIG)

// Set up Express server
const app = Express()
app.use((req, res, next) => {
  if (req.path !== '/') {
    res.header('Content-Type', 'application/json')
    res.header('Access-Control-Allow-Origin', '*')
  }
  next()
})

// Basic logging
const pad = n => n < 10 ? `0${n}` : n
const log = msg => {
  const d = new Date()
  const yr  = d.getFullYear()
  const mth = d.getMonth() + 1
  const day = d.getDate()
  const hr  = pad(d.getHours())
  const min = pad(d.getMinutes())
  const sec = pad(d.getSeconds())

  console.log(`[ ${yr}-${mth}-${day} ${hr}:${min}:${sec} ] ${msg}`)
}

// Serve prod
// app.use(Express.static('build'))

// Add endpoints

app.get('/resource', (req, res) => {
  const public_id = decodeURIComponent(req.query.public_id)
  const expression = `public_id="${public_id}"`
  const max_results = 1

  log(`User requested resource with public_id ${public_id}`)

  const search = new Cloudinary.v2.search()
    .expression(expression)
    .max_results(max_results)
    .with_field('tags')

  search.execute((err, result) => res.send(err || result))
})

app.get('/resources', (req, res) => {
  const folder = req.query.path
  const expression = `folder="${folder}"`
  const max_results = req.query.max_results
  const next_cursor = req.query.hasOwnProperty('next_cursor')
    ? req.query.next_cursor
    : null

  log(`User requested ${max_results}${next_cursor ? ' more' : ''} files at /${folder}`)

  // Build search query
  const search = new Cloudinary.v2.search()
    .expression(expression)
    .max_results(max_results)
    .sort_by('filename', 'asc') //TODO: custom sorting
    .with_field('tags')

  // For requesting next page of results
  if (next_cursor) {
    search.next_cursor(next_cursor)
  }

  // Execute search
  search.execute((err, result) => res.send(err || result))
})

app.get('/folders', (req, res) => {
  const path = req.query.path
  const endpoint = path === '' ? 'root_folders' : 'sub_folders'

  log(`User requested folders at /${path}`)

  Cloudinary.v2.api[endpoint](
    path,
    (err, result) => res.send(err || result)
  )
})

// Perform an API search
app.get('/search', (req, res) => {
  const query = req.query.q
  const max_results = req.query.max_results
  const next_cursor = req.query.hasOwnProperty('next_cursor')
    ? req.query.next_cursor
    : null

  log(`User ${next_cursor ? 'loaded more results' : 'searched'} for \`${query}\``)

  // Build search query
  const search = new Cloudinary.v2.search()
    .expression(query)
    .max_results(max_results)
    .sort_by('filename', 'asc') //TODO: custom sorting
    .with_field('tags');

  // For requesting next page of results
  if (next_cursor) {
    search.next_cursor(next_cursor)
  }

  // Execute search
  search.execute((err, result) => res.send(err || result))
})

function getSignableString(timestamp, public_ids, split = false) {
  const pids = split
    ? public_ids.map(pid => `&public_ids[]=${pid}`).join('')
    : '&public_ids=' + public_ids.join(',')
  return `allow_missing=1&flatten_folders=true&mode=download${pids}&target_public_id=cloudinary_images.zip&timestamp=${timestamp}`
}

// Create a .zip URL of files
app.get('/download', (req, res) => {
  // Parse public IDs
  const public_ids = decodeURIComponent(req.query.public_ids).split(',')
  if (!public_ids || !Array.isArray(public_ids)) {
    res.send('')
    return
  }

  // Generate ZIP url
  log('Generating .zip archive with ' + public_ids.length + ' files...')

  const timestamp = Date.now()
  const signable = getSignableString(timestamp, public_ids)
  const signature = Crypto.createHash('sha1').update(signable + CONFIG.api_secret).digest('hex')

  const download_url = `https://api.cloudinary.com/v1_1/${CONFIG.cloud_name}/image/generate_archive`
    + '?' + getSignableString(timestamp, public_ids, true)
    + `&api_key=${CONFIG.api_key}`
    + `&signature=${signature}`

  res.send({ download_url })
})

// Start server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
