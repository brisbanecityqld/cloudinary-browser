import React from 'react'

import Button from './button'
import Checkbox from './checkbox'

import styles from '../styles/fileheader.css'

export default function FileHeader (props) {
  const anyChecked = props.checkedFiles && props.checkedFiles.length > 0

  let css = (props.viewmode === 'list' && !anyChecked ? styles.list : styles.grid)
  if (props.showListDetails) {
    css += ' ' + styles.showListDetails
  }
  return (
    <div className={css}>
      <Checkbox className={styles.checkbox} value={props.checked} onToggle={props.onCheckboxToggle} label={'Select all'} />
      <div className={styles.image}></div>
      <div className={styles.title}>Name</div>
      <div className={styles.upload}>Uploaded at</div>
      <div className={styles.tags}>Tags</div>
      {
        anyChecked && (
          <div className={styles.actions}>
            <Button clear
              onClick={props.onClearChecked}
              icon="times"
              label="Clear checked" showLabel />
            <Button clear
              onClick={props.downloadSelected}
              icon="cloud-download-alt"
              label={'Download' + (props.checkedFiles.length > 1 ? ' .zip' : '')} showLabel />
          </div>
        )
      }
    </div>
  )
}
