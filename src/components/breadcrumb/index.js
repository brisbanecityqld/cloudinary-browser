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
function makeTrailCrumb (name, route, isLink) {
  if (!isLink) {
    return <span key={route}>{name}</span>
  }
  return <Link key={route} to={route}><span className={styles.crumb}>{name}</span></Link>
}

function makeTrailSeparator (index) {
  return <span key={`${index}-sep`} className={styles.separator}>></span>
}

// Functional component
export default function Breadcrumb (props) {
  // Create breadcrumb HTML
  const trail = []

  const route = props.route
  const len = route.length

  if (route[0] === BROWSE_BASE) {
    // Breadcrumb trail for browsing
    for (let i = 1; i < len; i++) {
      const name = route[i]
      const partial = location.getPartialRoute(route, i + 1)

      trail.push(makeTrailSeparator(i))
      trail.push(makeTrailCrumb(name, partial, i !== len - 1))
    }
  }

  return (
    <div className={styles.main}>
      <Link to={`/${BROWSE_BASE}`}><span className={styles.crumb}>{BROWSE_BASE_NAME}</span></Link>
      {trail}
    </div>
  )
}
