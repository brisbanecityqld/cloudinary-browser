import React from 'react'

// Components
import Breadcrumb from '../breadcrumb/breadcrumb.jsx'
import Search from '../search/search.jsx'
import Button from '../button/button.jsx'

// Images
import BCC_logo from '../../images/bcc_logo.png'

// Styles
import styles from './header.css'

// Functional component
export default function Header (props) {
  return (
    <header className={styles.main}>
      <div className={styles.icon}><img src={BCC_logo} alt="logo" /></div>
      <Breadcrumb path={props.location.pathname} />
      <Search />
      <Button icon="image" className={styles.button} />
      <Button icon="list" className={styles.button} />
      <Button icon="cog" className={styles.button} />
    </header>
  )
}
