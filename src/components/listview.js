import React from 'react'

// Components
import FileHeader from './fileheader'
import Resource from './resource'

// Actions
import { VIEW_MODES } from '../actions'

// Styles
import styles from '../styles/listview.css'

// Alphabetically sort list of resource objects
function sortAlphabetical (a, b) {
  const strA = a.public_id.toLowerCase()
  const strB = b.public_id.toLowerCase()
  return (strA < strB)
    ? -1
    : (strA > strB)
    ? 1
    : 0
}

export default class ListView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      columnWidths: null
    }

    // Resource component generation
    this.generateResourceComponents = this.generateResourceComponents.bind(this)

    // Track scroll
    this.scrollableArea = null
    this.scrollTimeout = null
    this.debounceMS = 66

    // Method bindings
    this.handleScroll = this.handleScroll.bind(this)
    this.handleScrollEnd = this.handleScrollEnd.bind(this)
    this.handleColResize = this.handleColResize.bind(this)
  }

  handleColResize (columns) {
    console.log(columns)
  }

  handleScroll (event) {
    window.clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(() => this.handleScrollEnd(event), this.debounceMS)
  }

  handleScrollEnd (event) {
    const target = event.target

    // Handle scrolling to bottom of container
    if (
      target.scrollTop &&
      target.scrollTop + target.clientHeight === target.scrollHeight &&
      this.props.canLoadMore
    ) {
      // Load more resources
      this.props.onScrollToBottom()
    }
  }

  generateResourceComponents () {
    if (!this.props.hasOwnProperty('resources') || this.props.resources.length === 0) {
      return []
    }

    // Create array of resource components
    return this.props.resources
      .sort(sortAlphabetical)
      .map(file => (
        <Resource
          key={file.public_id}
          data={file}
          viewmode={this.props.viewmode}
          onClick={() => this.props.onResourceClick(encodeURIComponent(file.public_id))} />
      ))
  }

  // Init and deinit scroll event listener
  componentDidMount () {
    this.scrollableArea.addEventListener('scroll', this.handleScroll, false)
  }
  componentWillUnmount () {
    this.scrollableArea.removeEventListener('scroll', this.handleScroll)
  }

  render () {
    const resources = this.generateResourceComponents()
    const isList = this.props.viewmode === VIEW_MODES.LIST

    const inner = (resources.length > 0)
      ? resources
      : <div className={styles.empty}>There are no resources in this folder.</div>

    return <div className={isList ? styles.list : styles.grid}>
      {isList && <FileHeader onColResize={this.handleColResize} />}
      <div
        ref={div => this.scrollableArea = div}
        className={isList ? styles.listWrap : styles.gridWrap}>
        <div className={styles.scrollArea}>
          {inner}
        </div>
        {
          this.props.canLoadMore && (
            <div className={styles.loadMore}>
              <span onClick={this.props.onScrollToBottom}>Load more...</span>
            </div>
          )
        }
      </div>
    </div>
  }
}
