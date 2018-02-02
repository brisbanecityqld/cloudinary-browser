import React from 'react'

// Components
import ListView from '../listview'
import GridView from '../gridview'
import Resource from '../resource'

// Styles
import styles from './style.css'

// Alphabetically sort list of resource objects
function sortAlphabetical (a, b) {
  const strA = a.public_id.toLowerCase()
  const strB = b.public_id.toLowerCase()
  return (strA < strB)
    ? -1
    : (strA > strB)
    ? 1
    : 0
}

// Functional component
export default function Browser (props) {
  var resources = []

  if (props.files.length > 0) {
    // Create array of resource components
    resources = props.files
      .sort(sortAlphabetical)
      .map(file => (
        <Resource key={file.public_id} data={file} viewmode={props.viewmode} />
      ))
  }

  // Create a browser view
  const view = props.viewmode === 'list'
    ? <ListView children={resources} />
    : <GridView children={resources} />

  return (
    <div className={styles.main}>{view}</div>
  )
}
