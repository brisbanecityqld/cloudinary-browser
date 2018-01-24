import React from 'react'

// Components
import ListView from '../listview'
import GridView from '../gridview'

// Styles
import styles from './style.css'

// Functional component
export default function Browser (props) {
  let inner
  if (props.viewmode === 'list') {
    inner = <ListView files={props.files} />
  } else {
    inner = <GridView files={props.files} />
  }

  return (
    <div className={styles.main}>
      {inner}
      <div>{props.location.pathname}</div>
    </div>
  )
}
