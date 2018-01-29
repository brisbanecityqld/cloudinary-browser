import React from 'react';

// Components
import { Switch, Route, Redirect } from 'react-router-dom'
import DocumentTitle from 'react-document-title'

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

    // Cloudinary cloud name
    this.CLOUD_NAME = 'rosies'
    this.TITLE_SUFFIX = ' | BCC Image Browser'

    // Method bindings
    this.saveAppState = this.saveAppState.bind(this)

    this.setLoading = this.setLoading.bind(this)

    this.getCurrentFiles = this.getCurrentFiles.bind(this)
    this.getCurrentFolders = this.getCurrentFolders.bind(this)

    this.loadCurrentFolder = this.loadCurrentFolder.bind(this)
    this.markAsLoaded = this.markAsLoaded.bind(this)

    this.addResources = this.addResources.bind(this)
    this.addFolders = this.addFolders.bind(this)

    this.update = this.update.bind(this)
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
  getCurrentFiles (array = this.state.files) {
    const route = location.getAPIPath(this.state.currentRoute)
    return this.state.files.filter(file => {
      return file.folder === route
    })
  }

  // Find all subfolders that belong in current folder
  getCurrentFolders (array = this.state.folders) {
    let route = location.getAPIPath(this.state.currentRoute)
    if (route !== '') { route += '/' }

    return array.filter(folder => {
      return folder.path === `${route}${folder.name}`
    })
  }

  // Sets the current files, folders and favourites to pass to children
  update () {
    this.setState((prevState, props) => ({
      currentFiles: this.getCurrentFiles(prevState.files),
      currentFolders: this.getCurrentFolders(prevState.folders)
    }))
  }

  // Mark for reload
  setLoading (loading = true) {
    this.setState({ loading })
  }

  // Adds uploaded images to app state
  addResources (data) {
    // TODO: Handle next_cursor value somehow

    // Add images
    const resources = data.resources
    if (resources.length > 0) {
      this.setState((prevState, props) => ({
        files: [
          ...prevState.files.slice(),
          ...resources
        ]
      }))
    }
  }

  // Adds more folders to app state
  addFolders (data) {
    const folders = data.folders
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
  async loadCurrentFolder (force = false) {
    this.setLoading()

    const route = this.state.currentRoute

    // Is this folder already downloaded?
    if (this.state.loadedRoutes.indexOf(location.getRoute(route)) > -1 && !force) {
      this.setLoading(false)
      this.update()
    } else {
      try {
        // Download files and subfolders
        const path = location.getAPIPath(route)
        const [ resources, folders ] = await Promise.all([
          api.getResources(path),
          api.getFolders(path)
        ])

        // Hide loading indicator
        this.setLoading(false)
        if (!force) { this.markAsLoaded(route) }

        // Add files and folders to memory
        this.addResources(resources)
        this.addFolders(folders)
        this.update()
      } catch (error) {
        console.error(error.message)

        // Hide loading indicator and handle error
        this.setLoading(false)
        this.handleAPIError(error)
      }
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
  updateFavourites (folder, add = true) {
    this.setState((prevState, props) => {
      let newFavourites
      const favIndex = prevState.favourites.findIndex(fav => fav.path === folder.path)

      if (add && favIndex === -1) {
        // Add a favourite
        newFavourites = [
          ...prevState.favourites.slice(),
          folder
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
    } else {
      // Other errors
      console.error(error.message)
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
        try {
          newState[key] = JSON.parse(saved)
        } catch (e) {
          console.error(`localStorage item ${value} is corrupt. Deleting...`)
          localStorage.removeItem(value)
        }
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
      }, this.loadCurrentFolder)
    }
  }

  render() {
    // Handle load error
    if (this.state.loadError) {
      // Redirect home
      return <Redirect to="/browse" />
    }

    const RoutedBrowser = props => {
      // Define props to inject
      const moreProps = {
        ...props,
        cloudName: this.CLOUD_NAME,
        route: this.state.currentRoute,
        loading: this.state.loading
      }

      // Return app inner structure
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

    const route = location.getAPIPath(this.state.currentRoute)
    const title = (route === '' ? 'Browse' : route) + this.TITLE_SUFFIX

    // Folders loaded
    return (
      <div className={styles.main}>
        <DocumentTitle title={title} />
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
