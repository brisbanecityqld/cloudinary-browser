import React from 'react'

// Components
import { Link } from 'react-router-dom'
import Breadcrumb from './breadcrumb'
import Search from './search'
import Button from './button'

// Images
import BCC_logo from '../images/bcc_logo.png'

// Libraries
import { location } from '../lib'

// Actions
import { VIEW_MODES } from '../actions'

// Styles
import styles from '../styles/header.css'

// Functional component
export default class Header extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchFocused: false
    }

    this.handleViewerClose = this.handleViewerClose.bind(this)
    this.handleSearchFocus = this.handleSearchFocus.bind(this)
    this.handleSearchBlur = this.handleSearchBlur.bind(this)
  }

  handleViewerClose () {
    location.goBackTo('/browse', this.props.location, this.props.history)
  }

  // Handle focus and blur events for search box
  handleSearchFocus () {
    this.setState({ searchFocused: true })
  }
  handleSearchBlur () {
    this.setState({ searchFocused: false })
  }
  render () {
    const vmIcon = (this.props.viewmode === VIEW_MODES.LIST) ? 'image' : 'list'
    const vmNext = (this.props.viewmode === VIEW_MODES.LIST) ? VIEW_MODES.GRID : VIEW_MODES.LIST

    const isViewer = this.props.location.pathname.indexOf('/view/') === 0
    const breadcrumbVisibility = !this.props.isMobile
    const buttonVisibility = !(this.state.searchFocused && this.props.isMobile)

    return (
      <header className={styles.main}>
        <div className={styles.icon}>
          <Link to="/browse"><img src={BCC_logo} alt="logo" /></Link>
        </div>
        {/* Breadcrumb trail */}
        {breadcrumbVisibility && (<Breadcrumb route={this.props.location.pathname} />)}
        {/* Conditional header spacer */}
        {!(breadcrumbVisibility || this.state.searchFocused) && <div className={styles.spacer}></div>}
        {/* Folder toggle button */}
        {
          !isViewer && this.props.isMobile && !this.state.searchFocused &&
          <Button icon="folder" className={styles.buttonRight} onClick={this.props.onToggleFolderTree} />
        }
        {/* Search area */}
        <Search
          isMobile={this.props.isMobile}
          onFocus={this.handleSearchFocus}
          onBlur={this.handleSearchBlur}
          onSubmit={this.props.onSearchSubmit} />
        {/* View mode switcher */}
        {
          !isViewer && buttonVisibility &&
          <Button icon={vmIcon} className={styles.button} onClick={() => this.props.setViewMode(vmNext)} />
        }
        {/* Force refresh button */}
        {
          !isViewer && buttonVisibility &&
          <Button icon="sync-alt" className={styles.button} onClick={this.props.reload} />
        }
        {/* Mobile viewer close button */}
        {
          isViewer && this.props.isMobile &&
          <Button icon="times" className={styles.button} onClick={this.handleViewerClose} />
        }
      </header>
    )
  }
}
