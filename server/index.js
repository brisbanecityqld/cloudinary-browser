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
  res.header('Content-Type', 'application/json')
  res.header('Access-Control-Allow-Origin', '*')
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

// Add endpoints
app.get('/resources', (req, res) => {
  const folder = req.query.path
  const expression = `folder="${folder}"`
  const max_results = req.query.max_results

  log(`User requested ${max_results} files at /${folder}`)

  new Cloudinary.v2.search()
    .expression(expression)
    .max_results(max_results)
    .execute((err, result) => res.send(err || result))
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
