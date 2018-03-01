import React from 'react'

// Components
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Button from './button'
import Tag from './tag'
import Checkbox from './checkbox'

// Actions
import { VIEW_MODES } from '../actions'

// Libraries
import { fileparser } from '../lib'

// Styles
import styles from '../styles/resource.css'

function _stop (event) {
  event.preventDefault()
  event.stopPropagation()
}

export default class File extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageLoaded: false
    }

    this.link = null
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleImageLoaded = this.handleImageLoaded.bind(this)
  }

  handleKeyDown (event) {
    if (event.key === ' ' && this.props.onCheckboxToggle) {
      _stop(event)
      this.props.onCheckboxToggle(!this.props.checked)
    }
  }

  handleImageLoaded () {
    this.setState({
      imageLoaded: true
    })
  }

  render () {
    let mainStyle = this.props.viewmode === VIEW_MODES.LIST
      ? styles.list
      : styles.grid
    if (this.props.showListDetails) {
      mainStyle += ' ' + styles.showListDetails
    }

    const imgStyle = this.state.imageLoaded
      ? (this.props.viewmode === VIEW_MODES.GRID ? styles.gridImage : undefined)
      : styles.imageHidden

    const { type, filename, sizes, thumbnail, uploaded, tags } = fileparser.parseResource(this.props.data)
    const viewUrl = '/view/' + encodeURIComponent(this.props.data.public_id)

    return (
      <div className={mainStyle} aria-label={'Resource: ' + filename} role="listitem">
        <Link ref={a => this.link = a} to={{ pathname: viewUrl, state: { canGoBack: true } }} role="link checkbox" aria-checked={this.props.checked.toString()} onKeyDown={this.handleKeyDown} />
        <Checkbox className={styles.checkbox} value={this.props.checked} onToggle={this.props.onCheckboxToggle} label={'Select resource'} tabIndex="-1" />
        <div className={styles.image}>
          <img
            className={imgStyle}
            onLoad={this.handleImageLoaded}
            src={thumbnail}
            alt={filename} />
          <FontAwesomeIcon icon={type === 'video' ? 'film' : 'image'} />
        </div>
        {}
        <div className={styles.title}>{filename}</div>
        <div className={styles.upload}>{uploaded}</div>
        <div className={styles.tags} aria-hidden="true">
          {tags.map(tag => <Tag text={tag} key={tag} />)}
        </div>
        <div className={styles.actions}>
          <Button invert
            icon="cloud-download-alt"
            label="Download resource"
            onClick={() => window.open(sizes.original)} />
        </div>
      </div>
    )
  }
}
