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
import fasImage from '@fortawesome/fontawesome-free-solid/faImage'
import fasList from '@fortawesome/fontawesome-free-solid/faList'
import fasSyncAlt from '@fortawesome/fontawesome-free-solid/faSyncAlt'
import fasCloudDownloadAlt from '@fortawesome/fontawesome-free-solid/faCloudDownloadAlt'
import fasCog from '@fortawesome/fontawesome-free-solid/faCog'
import fasStar from '@fortawesome/fontawesome-free-solid/faStar'
import fasFolder from '@fortawesome/fontawesome-free-solid/faFolder'
import fasSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import fasTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import fasArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft'

// Regular icons
import farStar from '@fortawesome/fontawesome-free-regular/faStar'

fontawesome.library.add(
  fasImage,
  fasList,
  fasCog,
  fasStar,
  fasSyncAlt,
  fasCloudDownloadAlt,
  fasFolder,
  fasSearch,
  fasTimes,
  fasArrowLeft,
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
