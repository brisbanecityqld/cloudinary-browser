import React from 'react'

// Components
import Breadcrumb from './breadcrumb'
import Search from './search'
import Button from './button'

// Images
import BCC_logo from '../images/bcc_logo.png'

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

    this.handleSearchFocus = this.handleSearchFocus.bind(this)
    this.handleSearchBlur = this.handleSearchBlur.bind(this)
  }

  // Handle focus and blur events for search box
  handleSearchFocus () {
    this.setState({ searchFocused: true })
  }
  handleSearchBlur () {
    this.setState({ searchFocused: false })
  }

  render () {
    return (
      <header className={styles.main}>
        <div className={styles.icon}><img src={BCC_logo} alt="logo" /></div>
        {!this.state.searchFocused && <Breadcrumb route={this.props.route} />}
        <Search
          onFocus={this.handleSearchFocus}
          onBlur={this.handleSearchBlur}
          onSubmit={this.props.onSearchSubmit} />
        <Button icon="list" className={styles.button} onClick={() => this.props.setViewMode(VIEW_MODES.LIST)} />
        <Button icon="image" className={styles.button} onClick={() => this.props.setViewMode(VIEW_MODES.GRID)} />
        <Button icon="sync-alt" className={styles.button} onClick={this.props.reload} />
      </header>
    )
  }
}
