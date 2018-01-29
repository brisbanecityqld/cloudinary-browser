import React from 'react'

// Components
import { CloudinaryContext } from 'cloudinary-react'
import ListView from '../listview'
import GridView from '../gridview'
import Resource from '../resource'

// Styles
import styles from './style.css'

// Functional component
export default function Browser (props) {
  const resources = props.files.map(file => (
    <Resource key={file.public_id} data={file} viewmode={props.viewmode} />
  ))

  const view = props.viewmode === 'list'
    ? <ListView children={resources} />
    : <GridView children={resources} />

  return (
    <div className={styles.main}>
      <CloudinaryContext cloudName={props.cloudName}>{view}</CloudinaryContext>
    </div>
  )
}
