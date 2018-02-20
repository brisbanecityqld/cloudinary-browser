import React from 'react'

// Components
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Button from './button'

// Actions
import { VIEW_MODES } from '../actions'

// Libraries
import { fileparser } from '../lib'

// Styles
import styles from '../styles/resource.css'

export default class File extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      imageLoaded: false
    }

    this.handleImageLoaded = this.handleImageLoaded.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {

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

    const { filename, url, attachmentUrl, uploaded, tags } = fileparser.parseResource(this.props.data, 240, 180)
    const viewUrl = '/view/' + encodeURIComponent(this.props.data.public_id)

    // this.props.history.push('/view/' + publicId, { canGoBack: true })

    return (
      <div className={mainStyle} onClick={this.handleClick}>
        <Link to={{ pathname: viewUrl, state: { canGoBack: true } }} />
        <div className={styles.checkbox}>
          <div></div>
        </div>
        <div className={styles.image}>
          <img
            className={imgStyle}
            onLoad={this.handleImageLoaded}
            src={url}
            alt={filename} />
          <FontAwesomeIcon icon="image" />
        </div>
        {}
        <div className={styles.title}>{filename}</div>
        <div className={styles.upload}>{uploaded}</div>
        <div className={styles.tags}>
          {tags.map(tag => (<span className={styles.tag} key={tag}>{tag}</span>))}
        </div>
        <div className={styles.actions}>
          <Button
            invert
            icon="cloud-download-alt"
            onClick={() => window.open(attachmentUrl)} />
        </div>
      </div>
    )
  }
}
