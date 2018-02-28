import { connect } from 'react-redux'
import App from '../App'

import {
  setViewMode,
  setAppView,
  setCurrentRoute,
  markAsLoaded,
  addResources,
  addFolders,
  unloadFolder,
  setSearch,
  setSearchPending,
  clearAllChecked
} from '../actions'

const mapStateToProps = state => {
  return {
    viewmode: state.viewmode,
    appView: state.currentView,
    route: state.currentRoute,
    loadedRoutes: state.loadedRoutes,
    currentSearch: state.search,
    currentFile: state.currentFile
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setViewMode: mode => dispatch(setViewMode(mode)),
    setAppView: view => dispatch(setAppView(view)),
    updateRoute: route => dispatch(setCurrentRoute(route)),
    markAsLoaded: (path, nextCursor) => dispatch(markAsLoaded(path, nextCursor)),
    addResources: files => dispatch(addResources(files)),
    addFolders: folders => dispatch(addFolders(folders)),
    unloadFolder: route => dispatch(unloadFolder(route)),
    setSearch: search => dispatch(setSearch(search)),
    refreshSearch: () => dispatch(setSearchPending(true)),
    clearAllChecked: () => dispatch(clearAllChecked())
  }
}

const WrappedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default WrappedApp
