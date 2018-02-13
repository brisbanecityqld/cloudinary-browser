import React from 'react'

// Components
import Cloudinary from 'cloudinary'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

// Actions
import { VIEW_MODES } from '../actions'

// Styles
import styles from '../styles/resource.css'

export default class File extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageLoaded: false
    }

    this.img = null

    // Parse upload date in form: 2018-01-01T00:00:00
    this.dateRegex = /(\d+)-(\d+)-(\d+)T(\d+:\d+)/

    this.parseData = this.parseData.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
  }

  // Returns image data in a useable format
  parseData () {
    const data = this.props.data

    // Create filename
    const filename = data.filename + '.' + data.format

    // Get file URL
    const url = Cloudinary.url(data.public_id, { width: 240, height: 180, crop: 'fill' })

    const [,year,month,day,time] = this.dateRegex.exec(data.uploaded_at)
    const uploaded = `${day}/${month}/${year} ${time}`

    // Generate tags
    let tags = (data.tags.length > 0)
      ? data.tags.map(tag => (<span className={styles.tag} key={tag}>{tag}</span>))
      : undefined

    return {
      filename,
      url,
      uploaded,
      tags
    }
  }

  handleImageLoaded () {
    this.setState({
      imageLoaded: true
    })
  }

  render () {
    const style = this.props.viewmode === VIEW_MODES.LIST
      ? styles.list
      : styles.grid

    const { filename, url, uploaded, tags } = this.parseData()
    const imageStyle = this.state.imageLoaded
      ? undefined
      : styles.imageHidden

    return (
      <div className={style}>
        <div className={styles.checkbox}>
          <div></div>
        </div>
        <div className={styles.image}>
          <img className={imageStyle}
               onLoad={this.handleImageLoaded}
               src={url}
               alt={filename} />
          <FontAwesomeIcon icon="image" />
        </div>
        {}
        <div className={styles.title}>{filename}</div>
        <div className={styles.upload}>{uploaded}</div>
        <div className={styles.tags}>{tags}</div>
        <div className={styles.actions}></div>
      </div>
    )
  }
}
