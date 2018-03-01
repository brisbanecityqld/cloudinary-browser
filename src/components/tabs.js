import React from 'react'

// Styles
import styles from '../styles/tabs.css'

function handleClick (props, tab) {
  props.onChange(tab)
}

function handleKeyDown (event, props, tab) {
  if (event.key === ' ' || event.key === 'Enter') {
    props.onChange(tab)
  }
}

export default function Tabs (props) {
  const tabs = props.tabs.map(tab => {
    const css = tab.active ? styles.activeTab : styles.tab
    return <div
      key={tab.name} className={css} onClick={() => handleClick(props, tab.name)} onKeyDown={event => handleKeyDown(event, props, tab.name)}
      role="tab" tabIndex="0" aria-selected={tab.active.toString()}>{tab.name}</div>
  })

  return <div role="tablist" className={styles.container}>{tabs}</div>
}
