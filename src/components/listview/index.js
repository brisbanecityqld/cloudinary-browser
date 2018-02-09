import React from 'react'

// Components
import FileHeader from '../fileheader'

// Actions
import { VIEW_MODES } from '../../actions'

// Styles
import styles from './style.css'

export default class ListView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      columnWidths: null
    }

    // Track scroll
    this.scrollableArea = null
    this.scrollTimeout = null
    this.debounceMS = 66
    this.storageKey = 'ui_list_view_scroll_top'

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
      target.scrollTop === target.scrollTopMax &&
      this.props.canLoadMore
    ) {
      // Load more resources
      this.props.onScrollToBottom()
    }
  }

  // Init and deinit scroll event listener
  componentDidMount () {
    this.scrollableArea.addEventListener('scroll', this.handleScroll, false)
  }
  componentWillUnmount () {
    this.scrollableArea.removeEventListener('scroll', this.handleScroll)
  }

  render () {
    const isList = this.props.viewmode === VIEW_MODES.LIST
    const style = isList ? styles.list : styles.grid

    const inner = (this.props.children.length > 0)
      ? this.props.children
      : <div className={styles.empty}>There are no resources in this folder.</div>

    return <div className={style}>
      {isList && <FileHeader onColResize={this.handleColResize} />}
      <div ref={div => this.scrollableArea = div} className={styles.scrollArea}>
        {inner}
        {this.props.canLoadMore && <div className={styles.loadMore}>Load more...</div>}
      </div>
    </div>
  }
}
