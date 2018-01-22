import React from 'react'

// Styles
import styles from './breadcrumb.css'

const ROOT_FOLDER = 'Brisbane City Council'

// Functions
function makeTrail (pathArray, index) {
  return '/' + pathArray.slice(0, index + 1).join('/')
}

function makeTrailCrumb (pathArray, index) {
  const href = makeTrail(pathArray, index)
  const name = pathArray[index]

  return <a key={index} className={styles.crumb} href={href}>{name}</a>
}

function makeTrailSeparator (index) {
  return <span key={`${index}-sep`} className={styles.separator}>></span>
}

// Functional component
export default function Breadcrumb (props) {
  // Create breadcrumb HTML
  const path = props.path.split('/').slice(1)
  const length = path.length

  let trail = []
  for (let i = 0; i < length; i++) {
    // Add folder to trail
    trail.push(makeTrailSeparator(i))
    trail.push(makeTrailCrumb(path, i))
  }

  return (
    <div className={styles.main}>
      <a className={styles.crumb} href="/">{ROOT_FOLDER}</a>
      {trail}
    </div>
  )
}
