import React from 'react'

// Components
import { Link } from 'react-router-dom'

// Libraries
import { location } from '../../lib'

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
export default class Breadcrumb extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      needsUpdate: true,
      truncate: false
    }

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

  componentWillUpdate () {
    if (this.state.needsUpdate) {
      this.setState({ needsUpdate: false })

      // On route change, check if our trail has wrapped onto multiple lines
      const baseH = this.base.getBoundingClientRect().height
      const currentH = this.main.getBoundingClientRect().height
      if (currentH > baseH) {
        this.setState({ truncate: true })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!location.matches(this.props.route, nextProps.route)) {
      this.setState({
        needsUpdate: true,
        truncate: false
      })
    }
  }

  render () {
    const trail = this.makeTrail()
    const css = (this.state.truncate ? styles.truncate : styles.main)

    return (
      <div ref={elem => this.main = elem} className={css}>
        <Link to={`/${BROWSE_BASE}`}>
          <span ref={elem => this.base = elem} className={styles.crumb}>{BROWSE_BASE_NAME}</span>
        </Link>
        {trail}
      </div>
    )
  }
}
