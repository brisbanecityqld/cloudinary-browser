import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import styles from '../styles/tooltip.css'

export default function Tooltip (props) {
  return (
    <div className={styles.main}>
      <FontAwesomeIcon icon="info-circle" />
      <div className={styles.popup}>{props.children}</div>
    </div>
  )
}
