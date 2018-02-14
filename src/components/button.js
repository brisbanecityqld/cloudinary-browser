import React from 'react'

// Components
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

// Styles
import styles from '../styles/button.css'

function handleClick (event, props) {
  if (typeof props.onClick === 'function') {
    props.onClick(event)
  }
}

function handleMouseDown (event, props) {
  if (typeof props.onMouseDown === 'function') {
    props.onMouseDown(event)
  }
}

// Functional component
export default function Button (props) {
  let css = props.invert ? styles.invert : styles.main

  // Get icon
  let icon
  if (props.icon) {
    icon = (
      <span className={styles.icon}>
        <FontAwesomeIcon icon={props.icon} />
      </span>
    )
  }

  let text
  if (props.text) {
    text = <span className={styles.label}>{props.text}</span>
    css += ' ' + styles.text
  }

  // Allow passing classes down
  if (props.className) {
    css += ' ' + props.className
  }

  return (
    <div
      className={css}
      onClick={event => handleClick(event, props)}
      onMouseDown={event => handleMouseDown(event, props)}>
      {icon}{text}
    </div>
  )
}
