import React from 'react'

// Components
import { Image, Transformation } from 'cloudinary-react'

// Styles
import styles from './style.css'

export default function File (props) {
  const data = props.data
  const style = props.viewmode === 'list'
    ? styles.list
    : styles.grid

  const filename = data.filename + '.' + data.format

  return (
    <div className={style}>
      <Image publicId={data.public_id}>
        <Transformation width="100" height="75" crop="fill" />
      </Image>
      <div className={styles.title}>{filename}</div>
      <div className={styles.upload}>{data.uploaded_at}</div>
    </div>
  )
}
