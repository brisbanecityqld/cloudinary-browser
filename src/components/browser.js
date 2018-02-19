import React from 'react'

// Components
import ListView from './listview'

// Styles
import styles from '../styles/browser.css'

// Functional component
export default function Browser (props) {
  const childProps = {
    resources: props.files,
    viewmode: props.viewmode,
    parentFolder: props.parentFolder,
    onScrollToBottom: props.onScrollToBottom,
    canLoadMore: props.nextCursor !== null,
    onResourceClick: props.onResourceClick
  }

  return (
    <div className={styles.main}>
      <ListView { ...childProps } />
    </div>
  )
}
