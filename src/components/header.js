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
    const isListView = this.props.viewmode === VIEW_MODES.LIST
    const vmIcon = (isListView) ? 'th' : 'list'
    const vmNext = (isListView) ? VIEW_MODES.GRID : VIEW_MODES.LIST

    // Constants for conditional rendering
    const isBrowser = this.props.appView === 'browse'
    const isViewer = this.props.appView === 'view'
    const isSearch = this.props.appView === 'search'
    const isMobile = this.props.isMobile
    const searchFocused = this.state.searchFocused

    return (
      <header className={styles[isMobile ? 'mobile' : 'main']} aria-label="Header and controls">
        <div className={styles.icon}>
          <Link to="/browse"><img src={BCC_logo} alt="logo" /></Link>
        </div>
        {/* Breadcrumb trail */}
        {
          !isMobile &&
          <Breadcrumb route={this.props.location.pathname} />
        }
        {/* Mobile UI spacer */}
        {
          isMobile && !searchFocused &&
          <div className={styles.spacer}></div>
        }
        {/* Folder toggle button */}
        {
          isBrowser && isMobile && !searchFocused &&
          <Button icon="folder" className={styles.buttonRight} onClick={this.props.onToggleFolderTree} label="Toggle folder tree" />
        }
        {/* Search area */}
        <Search
          initial={isSearch && this.props.currentSearch}
          isMobile={this.props.isMobile}
          onFocus={this.handleSearchFocus}
          onBlur={this.handleSearchBlur}
          onSubmit={this.props.onSearchSubmit} />
        {/* View mode switcher */}
        {
          !isViewer && !(isMobile && searchFocused) &&
          <Button icon={vmIcon} className={styles.button} onClick={() => this.props.setViewmode(vmNext)} label={'Switch to ' + (isListView ? 'grid' : 'list') + ' view'} />
        }
        {/* Force refresh button */}
        {
          !isViewer && !(isMobile && searchFocused) &&
          <Button icon="sync-alt" className={styles.button} onClick={this.props.reload} label="Force refresh" />
        }
        {/* Mobile viewer close button */}
        {
          isViewer && isMobile &&
          <Button icon="times" className={styles.button} onClick={this.handleViewerClose} label="Close" />
        }
      </header>
    )
  }
}
