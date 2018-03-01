import React from 'react'

import styles from '../styles/checkbox.css'

function _stop (event) {
  event.preventDefault()
  event.stopPropagation()
}

function handleClick (event, props) {
  _stop(event)
  props.onToggle(!props.value)
}

function handleKeyDown (event, props) {
  if (event.key === ' ') {
    _stop(event)
    props.onToggle(!props.value)
  }
}

export default function Checkbox (props) {
  const css = styles.main + (props.className ? ' ' + props.className : '')
  return (
    <div
      className={css} onClick={event => handleClick(event, props)} onKeyDown={event => handleKeyDown(event, props)}
      role="checkbox" aria-label={props.label} aria-checked={props.value.toString()}>
      <div tabIndex={props.tabIndex || "0"} className={props.value ? styles.innerChecked : styles.inner}></div>
    </div>
  )
}
