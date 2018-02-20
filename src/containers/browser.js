import React from 'react'
import { connect } from 'react-redux'
import { updateFavourite } from '../actions'
import FolderTree from '../components/foldertree'
import ListView from '../components/listview'

// Selectors
import { getCurrentFiles, getCurrentFolders, getFavourites, getNextCursor } from '../selectors'

// Styles
import styles from '../App.css'

const mapStateToProps = (state) => {
  return {
    viewmode: state.viewmode,
    files: getCurrentFiles(state),
    folders: getCurrentFolders(state),
    favourites: getFavourites(state),
    nextCursor: getNextCursor(state)
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
    <FolderTree
      folders={props.folders}
      favourites={props.favourites}
      parentFolder={props.parentFolder}
      width={props.folderTreeWidth}
      folderTreeVisible={props.folderTreeVisible}
      onFoldersResize={props.onFoldersResize}
      onFoldersResizeEnd={props.onFoldersResizeEnd} />
    <ListView
      viewmode={props.viewmode}
      files={props.files}
      nextCursor={props.nextCursor}
      onScrollToBottom={props.onScrollToBottom}
      width={props.browserWidth} />
  </div>
)

const WrappedBrowser = connect(
  mapStateToProps,
  mapDispatchToProps
)(browserAndTree)

export default WrappedBrowser
