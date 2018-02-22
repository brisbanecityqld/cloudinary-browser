import React from 'react'

import Button from './button'
import Checkbox from './checkbox'

import styles from '../styles/fileheader.css'

export default function FileHeader (props) {
  let css = (props.viewmode === 'list' && !props.anyChecked ? styles.list : styles.grid)
  if (props.showListDetails) {
    css += ' ' + styles.showListDetails
  }
  return <div className={css}>
    <Checkbox className={styles.checkbox} value={props.checked} onToggle={props.onCheckboxToggle} />
    <div className={styles.image}></div>
    <div className={styles.title}>Name</div>
    <div className={styles.upload}>Uploaded at</div>
    <div className={styles.tags}>Tags</div>
    {
      props.anyChecked && (
        <div className={styles.actions}>
          <Button invert
            onClick={props.downloadSelected}
            icon="cloud-download-alt"
            text={'Download' + (props.checked ? ' all' : '')} />
        </div>
      )
    }
  </div>
}
