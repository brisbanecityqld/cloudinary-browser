import React from 'react'

import styles from '../styles/fileheader.css'

export default function FileHeader (props) {
  let css = styles.main
  if (props.showListDetails) {
    css += ' ' + styles.showListDetails
  }
  return <div className={css}>
    <div className={styles.checkbox}>
      <div></div>
    </div>
    <div className={styles.image}></div>
    <div className={styles.title}>Name</div>
    <div className={styles.upload}>Uploaded at</div>
    <div className={styles.tags}>Tags</div>
    <div className={styles.actions}></div>
  </div>
}
