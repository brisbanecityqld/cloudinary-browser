import React from 'react'

// Components
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

// Styles
import styles from '../styles/button.css'

function stop (event) {
  event.preventDefault()
  event.stopPropagation()
}

function handleClick (event, props) {
  if (typeof props.onClick === 'function') {
    props.onClick(event)
    stop(event)
  }
}

function handleMouseDown (event, props) {
  if (typeof props.onMouseDown === 'function') {
    props.onMouseDown(event)
    stop(event)
  }
}

function handleKeyDown (event, props) {
  if (event.key === 'Enter' || event.key === ' ') {
    props.onClick(event)
  }
}

// Functional component
export default function Button (props) {
  let css = props.invert
    ? styles.invert
    : props.clear
    ? styles.clear
    : styles.main

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
  if (props.showLabel) {
    text = <span className={styles.label}>{props.label}</span>
    css += ' ' + styles.text
  }

  // Allow passing classes down
  if (props.className) {
    css += ' ' + props.className
  }

  return (
    <div
      tabIndex={props.tabIndex || "0"}
      role="button"
      aria-label={props.label}
      className={css}
      onClick={event => handleClick(event, props)}
      onKeyDown={event => handleKeyDown(event, props)}
      onMouseDown={event => handleMouseDown(event, props)}>{icon}{text}</div>
  )
}
