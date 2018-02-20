import React from 'react'
import { connect } from 'react-redux'
import { addSearchResults } from '../actions'
import SearchResults from '../components/searchresults'

const mapStateToProps = state => {
  return {
    viewmode: state.viewmode,
    search: state.search,
    nextCursor: state.searchCursor,
    results: state.results
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSearchResults: (results, nextCursor) => dispatch(addSearchResults(results, nextCursor))
  }
}

const search = connect(
  mapStateToProps,
  mapDispatchToProps
)(props => <SearchResults { ...props } />)

export default search
