import React from 'react'
import ListView from './listview'
import Spinner from './spinner'

import { api } from '../lib'

import styles from '../App.css'

export default class SearchResults extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false
    }

    this.loading = this.loading.bind(this)
    this.doSearch = this.doSearch.bind(this)
    this.doNextSearch = this.doNextSearch.bind(this)
  }

  loading (loading = true) {
    this.setState({ loading })
  }

  async doSearch (props = this.props) {
    this.loading()

    // Perform search and handle results
    const search = props.search

    try {
      const results = await api.search(search)
      this.loading(false)

      // Set results and next cursor value
      results.total_count > 0 && this.props.addSearchResults(results.resources, results.next_cursor)
    } catch (e) {
      console.error(e)
    }
  }

  async doNextSearch () {
    if (this.props.nextCursor) {
      this.loading()

      // Perform search with next_cursor applied
      try {
        const results = await api.search(this.props.search, this.props.nextCursor)
        this.loading(false)

        results.total_count > 0 && this.props.addSearchResults(results.resources, results.next_cursor)
      } catch (e) {
        console.error(e)
      }
    }
  }

  componentWillMount () {
    this.props.results.length === 0
      && this.props.search !== ''
      && this.doSearch()
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.search !== this.props.search) {
      this.doSearch(nextProps)
    }
  }

  render () {
    return (
      <div className={styles.content}>
        <ListView
          isSearch
          isLoading={this.state.loading}
          nextCursor={this.props.nextCursor}
          files={this.props.results}
          onScrollToBottom={this.doNextSearch}
          { ...this.props } />
        {this.state.loading && <Spinner />}
      </div>
    )
  }
}