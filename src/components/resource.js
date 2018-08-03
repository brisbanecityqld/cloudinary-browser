import React from 'react'

// Components
import { Link } from 'react-router-dom'
import Observer from 'react-intersection-observer'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Button from './button'
import Tag from './tag'
import Checkbox from './checkbox'

// Actions
import { VIEW_MODES } from '../actions'

// Libraries
import { fileparser, analytics } from '../lib'

// Styles
import styles from '../styles/resource.css'

function _stop (event) {
  event.preventDefault()
  event.stopPropagation()
}

export default class File extends React.Component {
  constructor (props) {
    super(props)
    const { type, filename, sizes, thumbnail, uploaded, tags } = fileparser.parseResource(this.props.data)

    this.state = {
      loaded: false,
      visible: false,
      type,
      filename,
      sizes,
      thumbnail,
      uploaded,
      tags,

      // Set this once thumbnail is in view
      src: ''
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleInViewChange = this.handleInViewChange.bind(this)
  }

  handleKeyDown (event) {
    if (event.key === ' ' && this.props.onCheckboxToggle) {
      _stop(event)
      this.props.onCheckboxToggle(!this.props.checked)
    }
  }

  handleImageLoaded () {
    this.setState({
      loaded: true
    })
  }

  handleInViewChange (inView) {
    if (inView && this.state.src === '') {
      this.setState({
        src: this.state.thumbnail
      })
    }
  }

  render () {
    let mainStyle = this.props.viewmode === VIEW_MODES.LIST
      ? styles.list
      : styles.grid
    if (this.props.showListDetails) {
      mainStyle += ' ' + styles.showListDetails
    }

    const imgStyle = this.state.loaded
      ? (this.props.viewmode === VIEW_MODES.GRID ? styles.gridImage : undefined)
      : styles.imageHidden

    const viewUrl = '/view/' + encodeURIComponent(this.props.data.public_id)

    return (
      <Observer tag="div" className={mainStyle} aria-label={'Resource: ' + this.state.filename} role="listitem" onChange={this.handleInViewChange}>
        <Link to={{ pathname: viewUrl, state: { canGoBack: true } }} role="link checkbox" aria-checked={this.props.checked.toString()} onKeyDown={this.handleKeyDown} />
        <Checkbox className={styles.checkbox} value={this.props.checked} onToggle={this.props.onCheckboxToggle} label={'Select resource'} tabIndex="-1" />
        <div className={styles.image}>
          <img
            className={imgStyle}
            onLoad={this.handleImageLoaded}
            src={this.state.src}
            alt={this.state.filename} />
          <FontAwesomeIcon icon={this.state.type === 'video' ? 'film' : 'image'} />
        </div>
        <div className={styles.title}>{this.state.filename}</div>
        <div className={styles.upload}>{this.state.uploaded}</div>
        <div className={styles.tags} aria-hidden="true">
          {this.state.tags.map(tag => <Tag text={tag} key={tag} />)}
        </div>
        <div className={styles.actions}>
          <Button invert
            icon="cloud-download-alt"
            label="Download resource"
            onClick={() => {
              window.open(this.state.sizes.original)
              // Track download click
              analytics.userDownloadedResource(this.props.data.public_id)
            }} />
        </div>
      </Observer>
    )
  }
}
