import React from 'react'

// Styles
import styles from './browser.css'

// Functional component
export default function Browser (props) {
  return (
    <div className={styles.main}>
      <h1>Browser component</h1>
      <p>{props.location.pathname}</p>
    </div>
  )
}
