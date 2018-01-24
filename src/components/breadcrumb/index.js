import React from 'react'

// Components
import { Link } from 'react-router-dom'

// Libraries
import location from '../../lib/location.js'

// Styles
import styles from './style.css'

// Constants
const BROWSE_BASE = 'browse'
const BROWSE_BASE_NAME = 'Brisbane City Council'

// Functions
function makeTrailCrumb (route, index) {
  const name = route[index]
  const partial = location.getPartialRoute(route, index + 1)
  return <Link key={index} to={partial}><span className={styles.crumb}>{name}</span></Link>
}

function makeTrailSeparator (index) {
  return <span key={`${index}-sep`} className={styles.separator}>></span>
}

// Functional component
export default function Breadcrumb (props) {
  // Create breadcrumb HTML
  const trail = []

  const route = location.splitRoute(props.path)
  const len = route.length

  if (route[0] === BROWSE_BASE) {
    // Breadcrumb trail for browsing
    for (let i = 1; i < len; i++) {
      trail.push(makeTrailSeparator(i))
      trail.push(makeTrailCrumb(route, i))
    }
  }

  return (
    <div className={styles.main}>
      <Link to={`/${BROWSE_BASE}`}><span className={styles.crumb}>{BROWSE_BASE_NAME}</span></Link>
      {trail}
    </div>
  )
}
