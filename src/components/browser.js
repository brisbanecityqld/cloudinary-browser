import React from 'react'

// Components
import FileView from './listview'
import Resource from './resource'

// Styles
import styles from '../styles/browser.css'

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
        <Resource
          key={file.public_id}
          data={file}
          viewmode={props.viewmode}
          onClick={() => props.onResourceClick(encodeURIComponent(file.public_id))} />
      ))
  }

  const childProps = {
    children: resources,
    viewmode: props.viewmode,
    parentFolder: props.parentFolder,
    onScrollToBottom: props.onScrollToBottom,
    canLoadMore: props.nextCursor !== null
  }

  return (
    <div className={styles.main}>
      <FileView { ...childProps } />
    </div>
  )
}
