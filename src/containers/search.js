import React from 'react'
import { connect } from 'react-redux'
import { addSearchResults, updateChecked, clearAllChecked } from '../actions'
import { areAllFilesChecked } from '../selectors'
import SearchResults from '../components/searchresults'

const mapStateToProps = state => {
  return {
    viewmode: state.viewmode,
    search: state.search,
    nextCursor: state.searchCursor,
    results: state.results,
    checkedFiles: state.checked,
    allChecked: areAllFilesChecked(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSearchResults: (results, nextCursor) => dispatch(addSearchResults(results, nextCursor)),
    updateChecked: (path, newVal) => dispatch(updateChecked(path, newVal)),
    clearAllChecked: () => dispatch(clearAllChecked())
  }
}

const search = connect(
  mapStateToProps,
  mapDispatchToProps
)(props => <SearchResults { ...props } />)

export default search
