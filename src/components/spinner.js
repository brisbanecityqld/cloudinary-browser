import React from 'react'
import styles from '../styles/spinner.css'

export default function Spinner () {
  return (
    <div className={styles.background}>
      <div className={styles.main}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  )
}
