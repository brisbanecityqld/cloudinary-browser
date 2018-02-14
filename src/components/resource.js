import React from 'react'

// Components
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

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
    if (this.props.onClick) {
      this.props.onClick()
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

    const { filename, url, uploaded, tags } = fileparser.parseResource(this.props.data, 240, 180)

    return (
      <div className={style} onClick={this.handleClick}>
        <div className={styles.checkbox}>
          <div></div>
        </div>
        <div className={styles.image}>
          <img
            className={this.state.imageLoaded ? undefined : styles.imageHidden}
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
        <div className={styles.actions}></div>
      </div>
    )
  }
}
