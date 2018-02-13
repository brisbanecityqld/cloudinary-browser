// Helpers for parsing resources from Cloudinary API

import Cloudinary from 'cloudinary'

// Parse upload date in form: 2018-01-01T00:00:00
const DATE_REGEX = /(\d+)-(\d+)-(\d+)T(\d+:\d+)/


function parseResource (data, imgWidth, imgHeight) {
  if (!data) {
    return undefined
  }

  // Create filename
  const filename = data.filename + '.' + data.format

  // Get file URL
  const imgOpts = imgWidth > 0
    ? { width: imgWidth, height: imgHeight, crop: 'fill' }
    : {}
  const url = Cloudinary.url(data.public_id, imgOpts)

  const [,year,month,day,time] = DATE_REGEX.exec(data.uploaded_at)
  const uploaded = `${day}/${month}/${year} ${time}`

  // Generate tags
  const tags = data.tags
  // let tags = (data.tags.length > 0)
  //   ? data.tags.map(tag => (<span className={styles.main} key={tag}>{tag}</span>))
  //   : undefined

  return {
    filename,
    url,
    uploaded,
    tags
  }
}

export default {
  parseResource
}
