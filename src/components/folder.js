import React from 'react'

// Components
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Button from './button'

// Libraries
import { location } from '../lib'

// Styles
import styles from '../styles/folder.css'

function handleKeyDown (event, props) {
  if (event.key === ' ' && props.onClick) {
    event.preventDefault()
    event.stopPropagation()
    props.onClick()
  }
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
    iconLeft = (props.linkOnly ? 'arrow-left' : 'folder')
    iconRight = (props.isFavourite ? 'star' : ['far', 'star'])
    css = (props.isFavourite ? styles.starSelected : styles.star)
  }

  return (
    <Link to={route} aria-label={'Folder: ' + props.name} role="listitem link checkbox" aria-checked={(!!props.isFavourite).toString()} onKeyDown={event => handleKeyDown(event, props)}>
      <div className={styles.main}>
        <div className={styles.folder}><FontAwesomeIcon icon={iconLeft} /></div>
        <div className={styles.label} aria-hidden="true">{props.name}</div>
        {!props.linkOnly && <Button clear className={css} icon={iconRight} onClick={props.onClick} label="Toggle favourite" tabIndex="-1" />}
      </div>
    </Link>
  )
}
