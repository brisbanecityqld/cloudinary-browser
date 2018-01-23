// Simple backend for cloudinary-browser.
// Performs Cloudinary API requests and caches to a local DB.

const path = require('path')
const Express = require('express')
const Datastore = require('nedb')
const Cloudinary = require('cloudinary')

// Set up database
const DB_FILE = 'cache.db'
const db = new Datastore({ filename: path.resolve(__dirname, DB_FILE), autoload: true })
db.persistence.setAutocompactionInterval(360000)

// Set up Cloudinary
const CONFIG = require('./config')
Cloudinary.config(CONFIG)
