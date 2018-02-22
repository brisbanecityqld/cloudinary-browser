import React from 'react'
import { connect } from 'react-redux'
import { addSearchResults, updateChecked } from '../actions'
import SearchResults from '../components/searchresults'

const mapStateToProps = state => {
  return {
    viewmode: state.viewmode,
    search: state.search,
    nextCursor: state.searchCursor,
    results: state.results,
    checkedFiles: state.checked
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSearchResults: (results, nextCursor) => dispatch(addSearchResults(results, nextCursor)),
    updateChecked: (path, newVal) => dispatch(updateChecked(path, newVal))
  }
}

const search = connect(
  mapStateToProps,
  mapDispatchToProps
)(props => <SearchResults { ...props } />)

export default search
