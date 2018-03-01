import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './containers/app'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

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
  faArrowLeft,
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
  faArrowLeft,
  faCrop,
  faExpandArrowsAlt,
  faInfoCircle,
  faPlayCircle,
  farStar
)

// Redux store

// Load favourites from localStorage
const KEY_FAVOURITES = 'persisted_favourites'
const persistedState = {}

try {
  const storedFavourites = localStorage.getItem(KEY_FAVOURITES)
  if (storedFavourites) {
    const persistedFavourites = JSON.parse(storedFavourites)
    persistedState.favourites = persistedFavourites
  }
} catch (e) {
  console.warn(`Corrupt localStorage key ${KEY_FAVOURITES}, deleting...`)
  localStorage.removeItem(KEY_FAVOURITES)
}

// Create the store
const store = createStore(
  FileBrowser,
  getDefaultState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

// Make certain store keys persistent
persist(store)

// Configure Cloudinary
Cloudinary.config({ cloud_name: 'rosies' })

// Create app
const RoutedApp = withRouter(props => <App {...props} />)

ReactDOM.render(
  (
    <Provider store={store}>
      <Router>
        <RoutedApp />
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)

registerServiceWorker()
