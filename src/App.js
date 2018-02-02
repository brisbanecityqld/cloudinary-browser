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
      loading: false,
      loadError: false
    }

    // Cloudinary cloud name
    this.CLOUD_NAME = 'rosies'
    this.TITLE_SUFFIX = ' | BCC Image Browser'

    // Method bindings
    this.saveAppState = this.saveAppState.bind(this)

    this.setLoading = this.setLoading.bind(this)

    this.loadCurrentFolder = this.loadCurrentFolder.bind(this)
    this.forceReload = this.loadCurrentFolder.bind(this, true)

    this.handleAPIError = this.handleAPIError.bind(this)
  }

  saveAppState () {
    // Save select parts of app state to localStorage
    Object.entries(this.storageKeys).forEach(([ key, value ]) => {
      localStorage.setItem(key, JSON.stringify(this.state[value]))
    })
  }

  // Mark for reload
  setLoading (loading = true) {
    this.setState({ loading })
  }

  // Pulls the current folder from the API
  async loadCurrentFolder (force = false) {
    this.setLoading()

    const route = this.state.currentRoute
    const routeStr = location.getRoute(route)

    // If forced, remove all currently downloaded files & subfolders
    if (force) {
      this.removeRouteItems(routeStr)
    }

    // Is this folder already downloaded?
    const nextCursor = (this.state.loadedRoutes.hasOwnProperty(routeStr))
      ? this.state.loadedRoutes[routeStr]
      : null

    if (this.state.loadedRoutes.indexOf(routeStr) > -1 && !force) {
      this.setLoading(false)
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
        // this.addResources(resources)
        // this.addFolders(folders)
      } catch (error) {
        console.error(error.message)

        // Hide loading indicator and handle error
        this.setLoading(false)
        this.handleAPIError(error)
      }
    }
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
  }
  componentDidUpdate () {
    // Reset loading error
    if (this.state.loadError) {
      this.setState({ loadError: false })
    }
  }
  componentWillReceiveProps (nextProps) {
    // Check if moving to a new folder
    const match = location.matches(this.props.location.pathname, nextProps.location.pathname)

    // Mark route update
    if (!match) {
      this.props.updateRoute().then(this.loadCurrentFolder)
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
        <Header
          route={this.state.currentRoute}
          reload={this.forceReload} />
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
