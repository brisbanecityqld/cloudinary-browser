import { connect } from 'react-redux'
import { setCurrentRoute } from '../actions'
import App from '../App.js'

import location from '../lib/location.js'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateRoute: () => {
      const newRoute = location.splitRoute(ownProps.location.pathname)
      return dispatch(setCurrentRoute(newRoute))
    }
  }
}

const WrappedApp = connect(null, mapDispatchToProps)(App)
export default WrappedApp
