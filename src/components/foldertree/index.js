import React from 'react'

// Styles
import styles from './style.css'

export default function FolderTree (props) {
  const tmp = props.folders.map(folder => {
    return <div>{folder.name}</div>
  })

  return (
    <aside className={styles.main}>
      {tmp}
    </aside>
  )
}
