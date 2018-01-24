import React from 'react';

// Components
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom'

import Header from './components/header'
import FolderTree from './components/foldertree'
import Browser from './components/browser'
import Viewer from './components/viewer'
import Spinner from './components/spinner'

// Libraries
import api from './lib/api.js'
import location from './lib/location.js'
import filehelper from './lib/filehelper.js'

// Styles
import styles from './App.css'

// Init FontAwesome library
import fontawesome from '@fortawesome/fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faSolid)

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      viewmode: 'list',
      loading: false,
      currentRoute: location.splitRoute(this.props.location.pathname),
      doRouteUpdate: false,

      files: [],
      currentFiles: [],

      folders: [],
      currentFolders: [],

      loadedPaths: []
    }

    this.filterFolders = this.filterFolders.bind(this)
    this.filterFiles = this.filterFiles.bind(this)

    this.setLoading = this.setLoading.bind(this)
    this.loadCurrentFolder = this.loadCurrentFolder.bind(this)

    this.addFolders = this.addFolders.bind(this)
  }

  filterFiles (array = this.state.files) {
    const route = location.getAPIRoute(this.state.currentRoute)
    return this.state.files.filter(file => {
      return file.public_id.replace(route, '').indexOf('/') === -1
    })
  }

  filterFolders (array = this.state.folders) {
    let route = location.getAPIRoute(this.state.currentRoute)
    if (route !== '') {
      route += '/'
    }

    return array.filter(folder => {
      console.log(folder.path,'vs',`${route}${folder.name}`)
      return folder.path === `${route}${folder.name}`
    })
  }

  // Mark for reload
  setLoading (loading = true) {
    this.setState({ loading })
  }

  // Returns a COPY of the currently open folder
  get currentFolder () {
    const target = location.getAPIRoute(this.currentRoute)
    const folders = this.state.folders.slice()

    return folders.find(f => f.path === target)
  }

  // Adds more folders to app state
  addFolders (folders) {
    const newFolders = [
      ...this.state.folders.slice(),
      ...folders
    ]

    // Update master folder list and filtered list (current set)
    this.setState({
      folders: newFolders,
      currentFolders: this.filterFolders(newFolders)
    })
  }

  // Pulls the current folder from the API
  loadCurrentFolder () {
    this.setLoading()

    // Download files and subfolders
    api.getFolders(location.getAPIRoute(this.state.currentRoute))
      .then(folders => {
        // Add as subfolders of current folder
        this.addFolders(folders)
        this.setLoading(false)
      })
  }

  // Lifecycle hooks
  // Used for updating files and folders
  componentDidMount () {
    this.loadCurrentFolder()
  }
  componentDidUpdate () {
    if (this.state.doRouteUpdate) {
      this.setState({ doRouteUpdate: false })

      // Check if
    }
  }
  componentWillReceiveProps (nextProps) {
    // Check if moving to a new folder
    const match = location.matches(this.props.location.pathname, nextProps.location.pathname)

    // Mark route update
    if (!match) {
      console.log('Route changed from', this.props.location.pathname, 'to', nextProps.location.pathname)
      this.setState({
        currentRoute: location.splitRoute(nextProps.location.pathname),
        doRouteUpdate: true
      })
    }
  }

  render() {
    const RoutedBrowser = props => (
      <div className={styles.content}>
        <FolderTree folders={this.state.currentFolders} {...props} />
        <Browser files={this.state.currentFiles} viewmode={this.state.viewmode} {...props} />
      </div>
    )

    // Folders loaded
    return (
      <div className={styles.main}>
        <Header route={this.state.currentRoute} />
        <div className={styles.content}>
        {this.state.loading ? (<Spinner />) : null}
        <Switch>
          <Route path="/browse" component={RoutedBrowser} />
          <Route path="/view" component={Viewer} />
          <Redirect exact from="/*" to="/browse" />
        </Switch>
        </div>
      </div>
    )
  }
}
