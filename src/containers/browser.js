import React from 'react'
import { connect } from 'react-redux'
import { updateFavourite } from '../actions'
import FolderTree from '../components/foldertree'
import Browser from '../components/browser'

// Selectors
import { getCurrentFiles, getCurrentFolders, getFavourites } from '../selectors'

// Styles
import styles from '../App.css'

const mapStateToProps = (state) => {
  return {
    viewmode: state.viewmode,
    files: getCurrentFiles(state),
    folders: getCurrentFolders(state),
    favourites: getFavourites(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addFavourite: path => dispatch(updateFavourite(path)),
    removeFavourite: path => dispatch(updateFavourite(path, false))
  }
}

const browserAndTree = props => (
  <div className={styles.content}>
    <FolderTree { ...props } />
    <Browser { ...props } />
  </div>
)

const WrappedBrowser = connect(
  mapStateToProps,
  mapDispatchToProps
)(browserAndTree)

export default WrappedBrowser
