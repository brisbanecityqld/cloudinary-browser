import React from 'react'

// Components
import Cloudinary from 'cloudinary'

// Styles
import styles from './style.css'

export default function File (props) {
  const data = props.data
  const style = props.viewmode === 'list'
    ? styles.list
    : styles.grid

  // Create filename
  const filename = data.filename + '.' + data.format

  // Get file URL
  const url = Cloudinary.url(data.public_id, { width: 100, height: 75, crop: 'fill' })

  // Parse upload date in form: 2018-01-01T00:00:00
  const dateRegex = /(\d+)-(\d+)-(\d+)T(\d+:\d+)/
  const [,year,month,day,time] = dateRegex.exec(data.uploaded_at)

  return (
    <div className={style}>
      <div className={styles.image}>
        <img src={url} alt={filename} />
      </div>
      <div className={styles.title}>{filename}</div>
      <div className={styles.upload}>{`${day}/${month}/${year} ${time}`}</div>
    </div>
  )
}
