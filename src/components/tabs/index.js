import React from 'react'

// Styles
import styles from './style.css'

function handleClick (props, tab) {
  props.onChange(tab)
}

export default function Tabs (props) {
  const tabs = props.tabs.map(tab => {
    const css = tab.active ? styles.activeTab : styles.tab
    return <div key={tab.name} className={css} onClick={() => handleClick(props, tab.name)}>{tab.name}</div>
  })

  return <div className={styles.container}>{tabs}</div>
}
