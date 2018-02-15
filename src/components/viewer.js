import React from 'react'

// Components
import Spinner from './spinner'
import Button from './button'

// Libraries
import { fileparser, location } from '../lib'

// Styles
import styles from '../styles/viewer.css'

export default class Viewer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageLoaded: false
    }

    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleImageLoaded () {
    this.setState({
      imageLoaded: true
    })
  }

  // Handle "closing" the viewer
  handleClose () {
    location.goBackTo(
      location.getRouteFromPublicId(this.props.publicId),
      this.props.location,
      this.props.history
    )
  }

  render () {
    const data = fileparser.parseResource(this.props.resource)
    const filename = data ? data.filename : 'Loading file...'

    return (
      <div className={styles.main}>
        <div className={styles.image}>
          {
            data && (
              <img
                src={data.url}
                alt={data.filename}
                onLoad={this.handleImageLoaded}
                onClick={() => window.open(data.url)} />
            )
          }
          {!this.state.imageLoaded && <Spinner />}
        </div>
        <div className={styles.details}>
          <div className={styles.header}>
            <h1 className={styles.title}>{filename}</h1>
            <Button className={styles.closeButton} onClick={this.handleClose} icon="times" />
          </div>
          {/* Upload date */}
          {
            data && (
              <div className={styles.upload}>Uploaded: <span className={styles.bold}>{data.uploaded}</span></div>
            )
          }
          {/* Download button */}
          {
            data && (
              <div className={styles.actions}>
                <Button
                  invert
                  icon="cloud-download-alt"
                  text="Download"
                  onClick={() => window.open(data.attachmentUrl) } />
              </div>
            )
          }
          <div className={styles.tags}>
            {data && data.tags.map(tag => (<span className={styles.tag} key={tag}>{tag}</span>))}
          </div>
        </div>
      </div>
    )
  }
}
