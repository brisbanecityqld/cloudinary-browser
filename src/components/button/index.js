import React from 'react'

// Components
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

// Styles
import styles from './style.css'

// Functional component
export default function Button (props) {
  let css  = props.invert ? styles.invert : styles.main

  // Allow passing classes down
  if (props.className) {
    css += ' ' + props.className
  }

  return <div className={css}><FontAwesomeIcon icon={props.icon} /></div>
}
