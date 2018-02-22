import React from 'react'

import styles from '../styles/checkbox.css'

function handleClick (event, props) {
  event.preventDefault()
  event.stopPropagation()

  props.onToggle(!props.value)
}

export default function Checkbox (props) {
  const css = styles.main + (props.className ? ' ' + props.className : '')
  return (
    <div className={css} onClick={event => handleClick(event, props)}>
      <div className={props.value ? styles.innerChecked : styles.inner}></div>
    </div>
  )
}
