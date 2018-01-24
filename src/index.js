import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

const RoutedApp = withRouter(props => <App {...props} />)

ReactDOM.render(<Router><RoutedApp /></Router>, document.getElementById('root'))
registerServiceWorker()
