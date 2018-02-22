import React from 'react'

// Components
import FileHeader from './fileheader'
import Resource from './resource'

// Actions
import { VIEW_MODES } from '../actions'

// Styles
import styles from '../styles/listview.css'

export default class ListView extends React.Component {
  constructor (props) {
    super(props)

    // Resource component generation
    this.generateResourceComponents = this.generateResourceComponents.bind(this)
    this.checkAllFiles = this.checkAllFiles.bind(this)

    // Track scroll
    this.scrollableArea = null
    this.scrollTimeout = null
    this.debounceMS = 66

    this.widthThreshold = 800

    // Method bindings
    this.handleScroll = this.handleScroll.bind(this)
    this.handleScrollEnd = this.handleScrollEnd.bind(this)
  }

  get canLoadMore () {
    return this.props.nextCursor !== null
  }

  get showListDetails () {
    return this.props.width > this.widthThreshold
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
      this.canLoadMore
    ) {
      // Load more resources
      this.props.onScrollToBottom()
    }
  }

  checkAllFiles () {
    if (!this.props.files || this.props.files.length === 0) return

    // Should we check or uncheck all files?
    if (this.props.allChecked) {
      this.props.clearAllChecked()
    } else {
      for (let f of this.props.files) {
        this.props.updateChecked(f.public_id)
      }
    }
  }

  generateResourceComponents () {
    if (!this.props.files || this.props.files.length === 0) {
      return []
    }

    // Create array of resource components
    return this.props.files
      .map(file => (
        <Resource
          key={file.public_id}
          data={file}
          viewmode={this.props.viewmode}
          showListDetails={this.showListDetails}
          onClick={() => this.props.onResourceClick(encodeURIComponent(file.public_id))}
          checked={this.props.checkedFiles.indexOf(file.public_id) > -1}
          onCheckboxToggle={newVal => this.props.updateChecked(file.public_id, newVal)} />
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

    let mainClass = isList ? styles.list : styles.grid
    if (this.showListDetails) {
      mainClass += ' ' + styles.showListDetails
    }

    const emptyText = !this.props.isSearch
      ? 'There are no resources in this folder.'
      : this.props.isLoading
      ? 'Loading search results...'
      : 'Your search returned no results.'

    const inner = (resources.length > 0)
      ? resources
      : (<div className={styles.empty}>{emptyText}</div>)

    return (
      <div className={mainClass}>
        <FileHeader
          viewmode={this.props.viewmode}
          showListDetails={this.showListDetails}
          onColResize={this.handleColResize}
          checked={this.props.allChecked}
          onCheckboxToggle={this.checkAllFiles} />
        <div
          ref={div => this.scrollableArea = div}
          className={isList ? styles.listWrap : styles.gridWrap}>
          <div className={styles.scrollArea}>
            {inner}
          </div>
          {
            this.canLoadMore && (
              <div className={styles.loadMore}>
                <span onClick={this.props.onScrollToBottom}>Load more...</span>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
