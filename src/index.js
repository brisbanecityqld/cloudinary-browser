import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './containers/app'
import registerServiceWorker from './registerServiceWorker'

import { Router, withRouter } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { location, analytics } from './lib'

// Redux
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import FileBrowser from './reducers'
import { getDefaultState, persist } from './initState'

// Cloudinary
import Cloudinary from 'cloudinary'

// Import FontAwesome icons
import fontawesome from '@fortawesome/fontawesome'

// Solid icons
import {
  faImage,
  faFilm,
  faTh,
  faList,
  faSyncAlt,
  faCloudDownloadAlt,
  faCog,
  faStar,
  faFolder,
  faSearch,
  faChevronDown,
  faTimes,
  faLevelUpAlt,
  faCrop,
  faExpandArrowsAlt,
  faInfoCircle,
  faPlayCircle
} from '@fortawesome/fontawesome-free-solid'

// Regular icons
import farStar from '@fortawesome/fontawesome-free-regular/faStar'

fontawesome.library.add(
  faImage,
  faFilm,
  faTh,
  faList,
  faCog,
  faStar,
  faSyncAlt,
  faCloudDownloadAlt,
  faFolder,
  faSearch,
  faChevronDown,
  faTimes,
  faLevelUpAlt,
  faCrop,
  faExpandArrowsAlt,
  faInfoCircle,
  faPlayCircle,
  farStar
)

/**
 * Configure Cloudinary
 */

Cloudinary.config({ cloud_name: 'rosies' })

/**
 * Create Redux store
 */

const store = createStore(
  FileBrowser,
  getDefaultState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
persist(store)

/**
 * Set up Google Analytics
 */

const history = createHistory()
analytics.init('UA-114973376-2', process.env.NODE_ENV === 'development')

// Track page switches using history
const VALID_BASES = ['browse', 'view', 'search']

function trackPageLoad ({ pathname }) {
  const base = location.getRouteBase(pathname)
  const endpoint = (base === 'search' ? '' : '/') + decodeURIComponent(location.getAPIPath(pathname))
  const viewmode = (base === 'browse' ? store.getState().viewmode : undefined)

  if (VALID_BASES.indexOf(base) > -1) {
    analytics.visitedPage(pathname, endpoint, viewmode)
  }
}

// Track initial and all subsequent page loads
trackPageLoad(history.location)
history.listen(trackPageLoad)

/**
 * CREATE APP
 */

const RoutedApp = withRouter(props => <App {...props} />)

ReactDOM.render(
  (
    <Provider store={store}>
      <Router history={history}>
        <RoutedApp />
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)

registerServiceWorker()
