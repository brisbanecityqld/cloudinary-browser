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
  const url = Cloudinary.url(data.public_id, { width: 48, height: 36, crop: 'fill' })

  // Parse upload date in form: 2018-01-01T00:00:00
  const dateRegex = /(\d+)-(\d+)-(\d+)T(\d+:\d+)/
  const [,year,month,day,time] = dateRegex.exec(data.uploaded_at)

  // Generate tags
  let tags = (data.tags.length > 0)
    ? data.tags.map(tag => (<span className={styles.tag} key={tag}>{tag}</span>))
    : undefined

  return (
    <div className={style}>
      <div className={styles.checkbox}>
        <div></div>
      </div>
      <div className={styles.image}>
        <img src={url} alt={filename} />
      </div>
      <div className={styles.title}>{filename}</div>
      <div className={styles.upload}>{`${day}/${month}/${year} ${time}`}</div>
      <div className={styles.tags}>{tags}</div>
      <div className={styles.actions}></div>
    </div>
  )
}
