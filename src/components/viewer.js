import React from 'react'

// Components
import Spinner from './spinner'
import Button from './button'
import Tag from './tag'
import Select from './select'
import CustomImageForm from './customimageform'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

// Libraries
import { fileparser, location, analytics } from '../lib'

// Styles
import styles from '../styles/viewer.css'

export default class Viewer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageState: 'loading',
      downloadSize: 'original',
      showLinkCopySuccess: false
    }

    this.breakpoint = 420
    this.getDownloadUrl = this.getDownloadUrl.bind(this)
    this.handleDownloadClick = this.handleDownloadClick.bind(this)
    this.handleEmbedClick = this.handleEmbedClick.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.clipboardInput = null
    this.canCopy = document.queryCommandSupported('copy')
  }

  getDownloadUrl () {
    if (this.state.downloadSize !== 'custom') {
      // Download a preset image size
      const { sizes } = fileparser.parseResource(this.props.resource)
      return sizes[this.state.downloadSize]
    } else {
      // Download a custom size
      return fileparser.getDownloadUrl(
        this.props.resource.public_id,
        this.props.customFileSize.width,
        this.props.customFileSize.height,
        this.props.customFileSize.crop ? 'fill' : 'scale'
      )
    }
  }

  // Opens URL for selected download size
  handleDownloadClick () {
    window.open(this.getDownloadUrl())

    // Track download
    analytics.userDownloadedResource(this.props.resource.public_id)
  }

  // Copies a direct link to a resource to clipboard
  handleEmbedClick () {
    if (this.clipboardInput) {
      // Get download URL
      let url = this.getDownloadUrl()

      // Remove the attachment flag
      url = url
        .replace('fl_attachment', '')
        .replace(/,,/g, ',')
        .replace(/([^:])\/\//g, '$1/')
        .replace(/(\/,|,\/)/g, '/')

      // Focus input, then copy
      this.clipboardInput.value = url
      this.clipboardInput.select()
      if (document.execCommand('copy')) {
        this.setState({ showLinkCopySuccess: true })
      }
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
          label="Select a download resolution"
          className={styles.select}
          options={[ ...options, optCustom ]}
          value={this.state.downloadSize}
          onChange={downloadSize => this.setState({ downloadSize, showLinkCopySuccess: false })} />
        <Button invert icon="cloud-download-alt"
          label="Download" showLabel={this.props.width > this.breakpoint}
          onClick={this.handleDownloadClick} />
        {
          this.canCopy &&
          <Button invert icon="link"
            label={this.state.showLinkCopySuccess ? 'Copied!' : 'Copy link'} showLabel={this.props.width > this.breakpoint}
            onClick={this.handleEmbedClick} />
        }
        {
          this.canCopy &&
          <input type="text" className={styles.hiddenInput} ref={input => this.clipboardInput = input} />
        }
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
    const containingFolder = location.getRouteFromPublicId(this.props.publicId)
    const containingFolderName = location.getAPIPath(containingFolder) !== ''
      ? location.getAPIPath(containingFolder)
      : 'Root folder'

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
            <Button className={styles.closeButton} onClick={this.handleClose} icon="times" label="Close" />
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
                {/* Containing folder */}
                <div className={styles.row4 + ' ' + styles.key}>Folder</div>
                <div className={styles.row4 + ' ' + styles.value}><Link to={containingFolder}>{containingFolderName}</Link></div>
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
                      <Button invert icon="cloud-download-alt" label="Download"
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
