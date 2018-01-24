// Simple backend for cloudinary-browser.
// Performs Cloudinary API requests and caches to a local DB.

const path = require('path')
const Express = require('express')
const Cloudinary = require('cloudinary')

// Server settings
const PORT = 8000

// Set up Cloudinary
const CONFIG = require('./config')
Cloudinary.config(CONFIG)
const API = Cloudinary.v2.api

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

function sendResult (res, err, result) {
  if (err) {
    res.send(JSON.stringify(err))
  } else {
    res.send(JSON.stringify(result.folders))
  }
}

// Add endpoints
app.get('/files', (req, res) => {
  log('User requested files')
  res.sendStatus(200)
})

app.get('/folders', (req, res) => {
  const path = req.query.path
  const endpoint = path === '' ? 'root_folders' : 'sub_folders'

  log(`User requested folders at path /${path}`)

  API[endpoint](path, (err, result) => {
    sendResult(res, err, result)
  })
})

// Start server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
