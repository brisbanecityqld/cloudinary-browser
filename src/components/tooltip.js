import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import styles from '../styles/tooltip.css'

export default function Tooltip (props) {
  return (
    <div className={styles.main} role="tooltip" aria-describedby="tooltip-content" tabIndex="0">
      <FontAwesomeIcon icon="info-circle" />
      <div id="tooltip-content" className={styles.popup}>{props.children}</div>
    </div>
  )
}
