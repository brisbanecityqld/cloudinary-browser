import React from 'react'

// Components
import Spinner from './spinner'
import Button from './button'

// Libraries
import { fileparser } from '../lib'

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
    (
      this.props.location.state &&
      this.props.location.state.canGoBack
    )
      ? this.props.history.goBack(false)
      : this.props.history.push('/browse')
  }

  // Load file to display on component mount
  componentWillMount () {
    if (!this.props.match.params.public_id) {
      // Check that a resource was requested
      console.warn('Malformed /view URL')
      this.props.history.replace('/browse')
    } else if (this.props.resource === undefined) {
      // Resource hasn't been downloaded, do so
      // TODO: download resource
    }
  }

  render () {
    const data = fileparser.parseResource(this.props.resource)
    const filename = data ? data.filename : 'Loading file...'

    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{filename}</h1>
          <div className={styles.close}>
            <Button className={styles.closeButton} onClick={this.handleClose} icon="times" />
          </div>
        </div>
        <div className={styles.image}>
          {data && <img src={data.url} alt={data.filename} onLoad={this.handleImageLoaded} />}
          {!this.state.imageLoaded && <Spinner />}
        </div>
        <div className={styles.details}>
          {data && <div>Uploaded: <span className={styles.bold}>{data.uploaded}</span></div>}
          <div className={styles.tags}>
            {data && data.tags.map(tag => (<span className={styles.tag} key={tag}>{tag}</span>))}
          </div>
        </div>
      </div>
    )
  }
}
