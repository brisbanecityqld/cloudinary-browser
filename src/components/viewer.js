import React from 'react'

// Components
import Spinner from './spinner'
import Button from './button'
import Tag from './tag'

// Libraries
import { fileparser, location } from '../lib'

// Styles
import styles from '../styles/viewer.css'

export default class Viewer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageState: 'loading'
    }

    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleImageError = this.handleImageError.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleImageLoaded () {
    this.setState({
      imageState: 'loaded'
    })
  }

  handleImageError() {
    this.setState({
      imageState: 'error'
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

  componentWillReceiveProps (nextProps) {
    const data = fileparser.parseResource(nextProps.resource)
    if (data) {
      this.props.setCurrentFile(data.filename)
    }
  }

  render () {
    const data = fileparser.parseResource(this.props.resource)
    const filename = data ? data.filename : 'Loading file...'
    const img = this.state.imageState === 'error'
      ? (<div className={styles.error}>Cannot preview this resource.</div>)
      : data
      ? (
          <img
            src={data.url}
            alt={data.filename}
            onLoad={this.handleImageLoaded}
            onError={this.handleImageError}
            onClick={() => window.open(data.url)} />
        )
      : undefined

    return (
      <div className={styles.main}>
        <div className={styles.image}>
          {
            data && img
          }
          {this.state.imageState === 'loading' && <Spinner />}
        </div>
        <div className={styles.details}>
          <div className={styles.header}>
            <h1 className={styles.title}>{filename}</h1>
            <Button className={styles.closeButton} onClick={this.handleClose} icon="times" />
          </div>
          {/* File information */}
          {
            data && (
              <div className={styles.fileInfo}>
                {/* Upload date */}
                <div className={styles.key}>Uploaded</div>
                <div className={styles.value}>{data.uploaded}</div>
                {/* Resolution */}
                <div className={styles.key}>Resolution</div>
                <div className={styles.value}>{data.resolution}</div>
                {/* File size */}
                <div className={styles.key}>File size</div>
                <div className={styles.value}>{data.size}</div>
              </div>
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
            {data && data.tags.map(tag => <Tag text={tag} key={tag} />)}
          </div>
        </div>
      </div>
    )
  }
}
