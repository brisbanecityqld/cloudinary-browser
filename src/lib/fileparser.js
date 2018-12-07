// Helpers for parsing resources from Cloudinary API

import Cloudinary from 'cloudinary'

// Parse upload date in form: 2018-01-01T00:00:00
const DATE_REGEX = /(\d+)-(\d+)-(\d+)T(\d+:\d+)/

// Image sizes
const IMAGE_SIZES = [
  { name: 'large', length: 2400 },
  { name: 'medium', length: 1200 },
  { name: 'small', length: 600 },
  { name: 'thumbnail', length: 240 }
]

// Represent image resolution as a string
const _makeResolution = (w, h) => `${w} x ${h}px`

// Merge default and custom image options for URL generation
const _getImageOptions = (data, opts) => ({ flags: 'attachment', resource_type: data.resource_type, ...opts })

// Capitalisation
const _capitalise = str => str.charAt(0).toUpperCase() + str.slice(1)

// Class to create and expose multiple image sizes
class ImageSizes {
  constructor (data) {
    // Work out longest dimension of image
    const longSide = data.height > data.width ? 'height' : 'width'
    const wr = data.width / data.height
    const hr = data.height / data.width
    const maxDim = data[longSide]

    // Create array of sizes
    this._sizes = [
      {
        size: 'original',
        label: `Original (${_makeResolution(data.width, data.height)})`,
        url: Cloudinary.url(data.public_id, _getImageOptions(data))
      }
    ]

    for (let size of IMAGE_SIZES) {
      if (maxDim > size.length) {
        // Determine width and height
        let width = Math.round(size.length * (longSide === 'width' ? 1 : wr))
        let height = Math.round(size.length * (longSide === 'height' ? 1 : hr))
        this._sizes.push({
          size: size.name,
          label: `${_capitalise(size.name)} (${_makeResolution(width, height)})`,
          url: Cloudinary.url(data.public_id, _getImageOptions(data, { [longSide]: size.length, crop: 'scale' }))
        })
      }
    }
  }

  // Getters for various sizes
  get original () {
    const data = this._sizes.find(_ => _.size === 'original')
    return (data ? data.url : undefined)
  }

  get large () {
    const data = this._sizes.find(_ => _.size === 'large')
    return (data ? data.url : undefined)
  }

  get medium () {
    const data = this._sizes.find(_ => _.size === 'medium')
    return (data ? data.url : undefined)
  }

  get small () {
    const data = this._sizes.find(_ => _.size === 'small')
    return (data ? data.url : undefined)
  }

  get thumbnail () {
    const data = this._sizes.find(_ => _.size === 'thumbnail')
    return (data ? data.url : undefined)
  }

  // Return all image size data
  get all () {
    return this._sizes
  }
}

// Take resource data and parse into usable format
function parseResource (data, thumbWidth = 240, thumbHeight = 180) {
  if (!data) {
    return undefined
  }

  const type = data.resource_type

  // Create filename
  const filename = data.filename + '.' + data.format

  const [,year,month,day,time] = DATE_REGEX.exec(data.uploaded_at)
  const uploaded = `${day}/${month}/${year} ${time}`

  // File resolution
  const resolution = _makeResolution(data.width, data.height)

  // File size
  const base = 1024
  const byteSizes = ['b', 'kb', 'MB', 'GB', 'TB', 'PB']

  let bytes = data.bytes
  let thisSize = 0
  while (bytes > base && thisSize < byteSizes.length - 1) {
    bytes /= base
    thisSize++
  }

  // Round size to 2 decimal places
  const filesize = Math.floor(bytes * 100) / 100 + ' ' + byteSizes[thisSize]

  // Base thumbnail options
  const thumbOpts = { crop: 'scale' }
  if (data.width > data.height) {
    thumbOpts['height'] = thumbHeight
  } else {
    thumbOpts['width'] = thumbWidth
  }

  // Generic base info, used for all file types
  const output = {
    type,
    filename,
    uploaded,
    url: data.url,
    tags: data.tags,
    filesize,
    resolution
  }

  // Type-specific info
  switch (type) {
    // Image file type; requires thumbnail and multiple sizes for downloading
    case 'image':
      output.sizes = new ImageSizes(data)
      output.thumbnail = Cloudinary.url(data.public_id, thumbOpts)
      break
    // Video file type; requires full-size preview and thumbnail
    case 'video':
      output.duration = 0
      output.sizes = {
        original: Cloudinary.url(data.public_id, { resource_type: 'video', flags: 'attachment' }),
        large: Cloudinary.url(data.public_id + '.jpg', { resource_type: 'video' })
      }
      output.thumbnail = Cloudinary.url(data.public_id + '.jpg', Object.assign(thumbOpts, { resource_type: 'video' }))
      break
    default:
      break
  }

  return output
}

// Get a URL for downloading an image at any arbitrary size
function getDownloadUrl (publicId, width, height, crop) {
  return Cloudinary.url(publicId, { width, height, crop, flags: 'attachment' })
}

export default {
  parseResource,
  getDownloadUrl
}
