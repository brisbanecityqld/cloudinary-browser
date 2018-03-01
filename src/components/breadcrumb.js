import React from 'react'

// Components
import { Link } from 'react-router-dom'

// Libraries
import { location } from '../lib'

// Styles
import styles from '../styles/breadcrumb.css'

// Constants
const BROWSE_BASE = 'browse'
const BROWSE_BASE_NAME = 'Brisbane City Council'

// Functions
function makeTrailCrumb (name, route, isLink) {
  if (!isLink) {
    return <span tabIndex="0" aria-label={'Current folder: ' + name} key={route}>{name}</span>
  }
  return <Link key={route} to={route}><span className={styles.crumb}>{name}</span></Link>
}

function makeTrailSeparator (index) {
  return <span key={`${index}-sep`} className={styles.separator}>></span>
}

// Functional component
export default class Breadcrumb extends React.Component {
  constructor (props) {
    super(props)

    this.makeTrail = this.makeTrail.bind(this)
  }

  makeTrail () {
    // Create breadcrumb HTML
    const trail = []

    const route = location.splitRoute(this.props.route)
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

    return trail
  }

  render () {
    const trail = this.makeTrail()

    return (
      <div ref={elem => this.main = elem} className={styles.main}>
        <Link to={`/${BROWSE_BASE}`}>
          <span ref={elem => this.base = elem} className={styles.crumb}>{BROWSE_BASE_NAME}</span>
        </Link>
        {trail}
      </div>
    )
  }
}
