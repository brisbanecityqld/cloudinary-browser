import React from 'react';

// Components
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from './components/header'
import FolderTree from './components/foldertree'
import Browser from './components/browser'
import Viewer from './components/viewer'
import Spinner from './components/spinner'

// Libraries
import { api, location } from './lib'

// Styles
import styles from './App.css'

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
      favourites: [],

      loadedRoutes: [],

      loadError: false
    }

    // State keys
    this.storageKeys = {
      favourites: 'app_state_favourites',
      viewmode: 'ui_viewmode'
    }

    // Method bindings
    this.saveAppState = this.saveAppState.bind(this)

    this.setLoading = this.setLoading.bind(this)

    this.currentFolders = this.currentFolders.bind(this)
    this.currentFiles = this.currentFiles.bind(this)

    this.loadCurrentFolder = this.loadCurrentFolder.bind(this)
    this.markAsLoaded = this.markAsLoaded.bind(this)

    this.addFolders = this.addFolders.bind(this)
    this.setCurrentFolder = this.setCurrentFolder.bind(this)
    this.updateFavourites = this.updateFavourites.bind(this)

    this.handleAPIError = this.handleAPIError.bind(this)
  }

  saveAppState () {
    // Save select parts of app state to localStorage
    Object.entries(this.storageKeys).forEach(([ key, value ]) => {
      localStorage.setItem(key, JSON.stringify(this.state[value]))
    })
  }

  // Find all files that belong in current folder
  currentFiles (array = this.state.files) {
    const route = location.getAPIPath(this.state.currentRoute)
    return this.state.files.filter(file => {
      return file.public_id.replace(route, '').indexOf('/') === -1
    })
  }

  // Find all subfolders that belong in current folder
  currentFolders (array = this.state.folders) {
    let route = location.getAPIPath(this.state.currentRoute)
    if (route !== '') { route += '/' }

    return array.filter(folder => {
      return folder.path === `${route}${folder.name}`
    })
  }

  // Sets the current files and folders to pass to children
  setCurrentFolder () {
    this.setState((prevState, props) => ({
      currentFiles: this.currentFiles(prevState.files),
      currentFolders: this.currentFolders(prevState.folders)
    }))
  }

  // Mark for reload
  setLoading (loading = true) {
    this.setState({ loading })
  }

  // Adds more folders to app state
  addFolders (folders) {
    if (folders.length > 0) {
      this.setState((prevState, props) => ({
        folders: [
          ...prevState.folders.slice(),
          ...folders
        ]
      }))
    }
  }

  // Pulls the current folder from the API
  loadCurrentFolder () {
    this.setLoading()

    const route = this.state.currentRoute

    // Is this folder already downloaded?
    if (this.state.loadedRoutes.indexOf(location.getRoute(route)) > -1) {
      this.setLoading(false)

      this.setCurrentFolder()
    } else {
      // Download files and subfolders
      api.getFolders(location.getAPIPath(route))
        .then(folders => {
          // Hide loading indicator
          this.setLoading(false)
          this.markAsLoaded(route)

          // Add as subfolders of current folder
          this.addFolders(folders)
          this.setCurrentFolder()
        }).catch(error => {
          console.error(error.message)
          // Hide loading indicator
          this.setLoading(false)

          this.handleAPIError(error)
        })
    }
  }

  // Mark a folder as having been loaded into memory already
  markAsLoaded (routeArray) {
    const route = location.getRoute(routeArray)

    // Append new path to loaded paths
    this.setState((prevState, props) => ({
      loadedRoutes: [
        ...prevState.loadedRoutes.slice(),
        route
      ]
    }))
  }

  // Updates favourites list of folders
  updateFavourites (route, add = true) {
    this.setState((prevState, props) => {
      let newFavourites
      const favIndex = prevState.favourites.indexOf(route)

      if (add && favIndex === -1) {
        // Add a favourite
        newFavourites = [
          ...prevState.favourites.slice(),
          route
        ]
      } else if (!add && favIndex > -1) {
        // Remove a favourite
        newFavourites = [
          ...prevState.favourites.slice(0, favIndex),
          ...prevState.favourites.slice(favIndex + 1)
        ]
      }

      // Save favourites to localStorage
      localStorage.setItem(this.storageKeys.favourites, JSON.stringify(newFavourites))

      // Update state
      return { favourites: newFavourites }
    })
  }

  // Handles some API errors
  handleAPIError (error) {
    if (error.hasOwnProperty('http_code') && error.http_code === 404) {
      // Handle attempting to load a non-existant folder
      this.setState({
        loadError: true
      })
    }
  }

  // Lifecycle hooks
  // Used for updating files and folders, and app state
  componentWillMount () {
    this.loadCurrentFolder()

    // Load app state
    let newState = {}
    Object.entries(this.storageKeys).forEach(([ key, value ]) => {
      const saved = localStorage.getItem(value)
      if (saved) {
        newState[key] = JSON.parse(saved)
      }
    })

    this.setState(newState)
  }
  componentDidUpdate () {
    // Reset loading error
    if (this.state.loadError) {
      this.setState({
        loadError: false
      })
    }

    if (this.state.doRouteUpdate) {
      this.setState({
        doRouteUpdate: false
      })
      this.loadCurrentFolder()
    }
  }
  componentWillReceiveProps (nextProps) {
    // Check if moving to a new folder
    const match = location.matches(this.props.location.pathname, nextProps.location.pathname)

    // Mark route update
    if (!match) {
      // console.log('Route changed from', this.props.location.pathname, 'to', nextProps.location.pathname)
      this.setState({
        currentRoute: location.splitRoute(nextProps.location.pathname),
        doRouteUpdate: true
      })
    }
  }

  render() {
    // Handle load error
    if (this.state.loadError) {
      // Redirect home
      return <Redirect to="/browse" />
    }

    const RoutedBrowser = props => {
      const moreProps = { ...props, route: this.state.currentRoute }
      return (
        <div className={styles.content}>
          <FolderTree
            folders={this.state.currentFolders}
            favourites={this.state.favourites}
            updateFavourites={this.updateFavourites}
            {...moreProps}
          />
          <Browser
            files={this.state.currentFiles}
            viewmode={this.state.viewmode}
            {...moreProps}
          />
        </div>
      )
    }

    // Folders loaded
    return (
      <div className={styles.main}>
        <Header route={this.state.currentRoute} />
        {this.state.loading ? (<Spinner />) : null}
        <Switch>
          <Route path="/browse" component={RoutedBrowser} />
          <Route path="/view" component={Viewer} />
          <Redirect exact from="/*" to="/browse" />
        </Switch>
      </div>
    )
  }
}
