import React from 'react'
import { Link } from 'react-router-dom'

import styles from '../styles/tag.css'

// Functional component
export default function Tag (props) {
  const link = props.text.indexOf(' ') > -1
    ? '"' + props.text + '"'
    : props.text

  return (
    <Link to={'/search/' + link}>
      <span className={styles.tag}>{props.text}</span>
    </Link>
  )
}
