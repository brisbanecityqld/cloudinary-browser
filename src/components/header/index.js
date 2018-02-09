import React from 'react'

// Components
import Breadcrumb from '../breadcrumb'
import Search from '../search'
import Button from '../button'

// Images
import BCC_logo from '../../images/bcc_logo.png'

// Actions
import { VIEW_MODES } from '../../actions'

// Styles
import styles from './style.css'

// Functional component
export default function Header (props) {
  return (
    <header className={styles.main}>
      <div className={styles.icon}><img src={BCC_logo} alt="logo" /></div>
      <Breadcrumb route={props.route} />
      <Search />
      <Button icon="image" className={styles.button} onClick={() => props.setViewMode(VIEW_MODES.GRID)} />
      <Button icon="list" className={styles.button} onClick={() => props.setViewMode(VIEW_MODES.LIST)} />
      <Button icon="sync-alt" className={styles.button} onClick={props.reload} />
    </header>
  )
}
