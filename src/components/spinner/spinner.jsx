import React from 'react'
import styles from './spinner.css'

export default function Spinner () {
  return (
    <div className={styles.main}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  )
}
