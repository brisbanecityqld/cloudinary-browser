import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

// Redux
import { createStore } from 'redux'
import FileBrowser from './reducers'

// Cloudinary
import Cloudinary from 'cloudinary'

// Import FontAwesome icons
import fontawesome from '@fortawesome/fontawesome'

// Solid icons
import fasImage from '@fortawesome/fontawesome-free-solid/faImage'
import fasList from '@fortawesome/fontawesome-free-solid/faList'
import fasSyncAlt from '@fortawesome/fontawesome-free-solid/faSyncAlt'
import fasCog from '@fortawesome/fontawesome-free-solid/faCog'
import fasStar from '@fortawesome/fontawesome-free-solid/faStar'
import fasFolder from '@fortawesome/fontawesome-free-solid/faFolder'
import fasSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import fasTimes from '@fortawesome/fontawesome-free-solid/faTimes'

// Regular icons
import farStar from '@fortawesome/fontawesome-free-regular/faStar'

fontawesome.library.add(
  fasImage,
  fasList,
  fasCog,
  fasStar,
  fasSyncAlt,
  fasFolder,
  fasSearch,
  fasTimes,
  farStar
)

// Redux store
const store = createStore(
  FileBrowser,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

// Configure Cloudinary
Cloudinary.config({ cloud_name: 'rosies' })

const RoutedApp = withRouter(props => <App {...props} />)

ReactDOM.render(<Router><RoutedApp /></Router>, document.getElementById('root'))
registerServiceWorker()
