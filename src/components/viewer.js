import React from 'react'

// Components
import Spinner from './spinner'
import Button from './button'
import Tag from './tag'
import Select from './select'
import CustomImageForm from './customimageform'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

// Libraries
import { fileparser, location } from '../lib'

// Styles
import styles from '../styles/viewer.css'

export default class Viewer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageState: 'loading',
      downloadSize: 'original'
    }

    this.breakpoint = 420
    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  // Opens URL for selected download size
  handleDownloadClick () {
    if (this.state.downloadSize !== 'custom') {
      // Download a preset image size
      const { sizes } = fileparser.parseResource(this.props.resource)
      window.open(sizes[this.state.downloadSize])
    } else {
      // Download a custom size
      const url = fileparser.getDownloadUrl(
        this.props.resource.public_id,
        this.props.customFileSize.width,
        this.props.customFileSize.height,
        this.props.customFileSize.crop ? 'fill' : 'scale'
      )
      window.open(url)
    }
  }

  makeDownloadForm (data) {
    if (!data) return undefined

    // Options dropdown for multiple download sizes
    const options = data.sizes.all.map(size => (
      { label: size.label, value: size.size }
    ))
    const optCustom = { label: 'Custom...', value: 'custom' }

    // Return actions area
    return (
      <div className={styles.actions}>
        <Select
          className={styles.select}
          options={[ ...options, optCustom ]}
          value={this.state.downloadSize}
          onChange={downloadSize => this.setState({ downloadSize })} />
        <Button invert icon="cloud-download-alt"
          text={this.props.width > this.breakpoint ? 'Download' : ''}
          onClick={this.handleDownloadClick} />
        {
          this.state.downloadSize === 'custom' && (
            <CustomImageForm
              data={this.props.customFileSize}
              onChange={data => this.props.setCustomSize(data)} />
          )
        }
      </div>
    )
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

    // Update title filename
    if (data && data.filename !== this.props.currentFile) {
      this.props.setCurrentFile(data.filename)
    }
  }

  render () {
    const data = fileparser.parseResource(this.props.resource)

    // Parse resource into displayable data
    const filename = data ? data.filename : 'Loading file...'
    const img = this.state.imageState === 'error'
      ? (<div className={styles.error}>Cannot preview this resource.</div>)
      : data
      ? (
          <img
            src={data.sizes.large || data.sizes.original}
            alt={data.filename}
            onLoad={() => this.setState({ imageState: 'loaded' })}
            onError={() => this.setState({ imageState: 'error' })}
            onClick={() => window.open(data.url)} />
        )
      : undefined

    return (
      <div className={styles.main}>
        <div className={styles.image}>
          {data && img}
          {this.state.imageState === 'loading' && <Spinner />}
          {
            this.state.imageState === 'loaded' && data && data.type === 'video' &&
            <div className={styles.play}><FontAwesomeIcon icon="play-circle" /></div>
          }
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
                <div className={styles.row1 + ' ' + styles.key}>Uploaded</div>
                <div className={styles.row1 + ' ' + styles.value}>{data.uploaded}</div>
                {/* Resolution */}
                <div className={styles.row2 + ' ' + styles.key}>Resolution</div>
                <div className={styles.row2 + ' ' + styles.value}>{data.resolution}</div>
                {/* File size */}
                <div className={styles.row3 + ' ' + styles.key}>File size</div>
                <div className={styles.row3 + ' ' + styles.value}>{data.filesize}</div>
                {/* Video duration */}
              </div>
            )
          }
          {/* Download buttons */}
          {
            data && (
              data.type === 'image'
                ? this.makeDownloadForm(data)
                : (
                    <div className={styles.actions}>
                      <Button invert icon="cloud-download-alt" text="Download"
                          onClick={this.handleDownloadClick} />
                    </div>
                  )
            )
          }
          {/* Tags */}
          {data && data.tags.length > 0 && <h3>Tags</h3>}
          <div className={styles.tags}>
            {data && data.tags.map(tag => <Tag text={tag} key={tag} />)}
          </div>
        </div>
      </div>
    )
  }
}
