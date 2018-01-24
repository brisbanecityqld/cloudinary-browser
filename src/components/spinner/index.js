import React from 'react'
import styles from './style.css'

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
