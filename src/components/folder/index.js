import React from 'react'

// Components
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Button from '../button'

// Libraries
import { location } from '../../lib'

// Styles
import styles from './style.css'

// Handle click
function handleClick (event, props) {
  event.preventDefault()
  props.onClick()
}

export default function Folder (props) {
  const route = location.APIToRoute(props.path)
  let iconLeft
  let iconRight
  let css

  if (props.deletable) {
    iconLeft = 'star'
    iconRight = 'times'
    css = styles.delete
  } else {
    iconLeft = 'folder'
    iconRight = (props.isFavourite ? 'star' : ['far', 'star'])
    css = (props.isFavourite ? styles.starSelected : styles.star)
  }

  return (
    <Link to={route}>
      <div className={styles.main}>
        <div className={styles.folder}><FontAwesomeIcon icon={iconLeft} /></div>
        <div className={styles.label}>{props.name}</div>
        <Button className={css} icon={iconRight} onClick={event => handleClick(event, props)} />
      </div>
    </Link>
  )
}
