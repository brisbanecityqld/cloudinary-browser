import React from 'react'
import { connect } from 'react-redux'
import { updateFavourite, updateChecked, clearAllChecked } from '../actions'
import FolderTree from '../components/foldertree'
import ListView from '../components/listview'

// Selectors
import {
  getCurrentFiles,
  getCurrentFolders,
  getFavourites,
  getNextCursor,
  areAllFilesChecked
} from '../selectors'

// Styles
import styles from '../App.css'

const mapStateToProps = (state) => {
  return {
    viewmode: state.viewmode,
    files: getCurrentFiles(state),
    checkedFiles: state.checked,
    allChecked: areAllFilesChecked(state),
    folders: getCurrentFolders(state),
    favourites: getFavourites(state),
    nextCursor: getNextCursor(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addFavourite: path => dispatch(updateFavourite(path)),
    removeFavourite: path => dispatch(updateFavourite(path, false)),
    updateChecked: (path, newVal) => dispatch(updateChecked(path, newVal)),
    clearAllChecked: () => dispatch(clearAllChecked())
  }
}

const BrowserAndTree = props => (
  <div className={styles.content}>
    <FolderTree
      folders={props.folders}
      favourites={props.favourites}
      parentFolder={props.parentFolder}
      width={props.folderTreeWidth}
      folderTreeVisible={props.folderTreeVisible}
      onFoldersResize={props.onFoldersResize}
      onFoldersResizeEnd={props.onFoldersResizeEnd}
      addFavourite={props.addFavourite}
      removeFavourite={props.removeFavourite} />
    <ListView
      viewmode={props.viewmode}
      files={props.files}
      checkedFiles={props.checkedFiles}
      allChecked={props.allChecked}
      nextCursor={props.nextCursor}
      onScrollToBottom={props.onScrollToBottom}
      width={props.browserWidth}
      updateChecked={props.updateChecked}
      clearAllChecked={props.clearAllChecked} />
  </div>
)

const WrappedBrowser = connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserAndTree)

export default WrappedBrowser
