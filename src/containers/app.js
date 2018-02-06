import { connect } from 'react-redux'
import { setCurrentRoute, markAsLoaded, addResources, addFolders, unloadFolder } from '../actions'
import App from '../App.js'

import { location } from '../lib'

const mapStateToProps = state => {
  return {
    route: state.currentRoute,
    loadedRoutes: state.loadedRoutes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateRoute: route => dispatch(setCurrentRoute(route)),
    markAsLoaded: route => dispatch(markAsLoaded(route)),
    addResources: files => dispatch(addResources(files)),
    addFolders: folders => dispatch(addFolders(folders)),
    unloadFolder: route => dispatch(unloadFolder(location.getAPIPath(route)))
  }
}

const WrappedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default WrappedApp
