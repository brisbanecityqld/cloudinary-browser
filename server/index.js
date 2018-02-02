// Simple backend for cloudinary-browser.
// Performs Cloudinary API requests and caches to a local DB.

const Express = require('express')
const Cloudinary = require('cloudinary')

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
    .with_field('tags');

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

// Start server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
