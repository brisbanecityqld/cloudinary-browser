import React from 'react';

// Components
import { Switch, Route, Redirect } from 'react-router-dom'
import DocumentTitle from 'react-document-title'

import Header from './components/header'
import Viewer from './components/viewer'
import Spinner from './components/spinner'

import Browser from './containers/browser'

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
    this.loadFolder = this.loadFolder.bind(this)

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
  async loadFolder (route, force = false) {
    // Update route in store
    this.props.updateRoute(route)

    // Show loading indicator
    this.setLoading()

    // If forced, remove all currently downloaded files & subfolders
    if (force) {
      this.props.unloadFolder(route)
    }

    // Is this folder already downloaded?
    const nextCursor = (this.props.loadedRoutes.hasOwnProperty(route))
      ? this.state.loadedRoutes[route]
      : null

    if (this.props.loadedRoutes.indexOf(route) > -1 && !force) {
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
        if (!force) { this.props.markAsLoaded(route) }

        // Add files and folders to memory
        this.props.addResources(resources)
        this.props.addFolders(folders)
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
    this.loadFolder(this.props.location.pathname)
  }
  componentDidUpdate () {
    // Reset loading error
    if (this.state.loadError) {
      this.setState({ loadError: false })
    }
  }
  componentWillReceiveProps (nextProps) {
    // Update if we need to.
    if (!location.matches(this.props.location.pathname, nextProps.location.pathname)) {
      this.loadFolder(nextProps.location.pathname)
    }
  }

  render() {
    // Handle load error
    if (this.state.loadError) {
      // Redirect home
      return <Redirect to="/browse" />
    }

    const path = location.getAPIPath(this.props.location.pathname)
    const title = (path === '' ? 'Browse' : path) + this.TITLE_SUFFIX

    // Folders loaded
    return (
      <div className={styles.main}>
        <DocumentTitle title={title} />
        <Header
          route={this.props.location.pathname}
          reload={() => this.loadFolder(this.props.location.pathname, true)} />
        {this.state.loading ? (<Spinner />) : null}
        <Switch>
          <Route path="/browse" component={Browser} />
          <Route path="/view" component={Viewer} />
          <Redirect exact from="/*" to="/browse" />
        </Switch>
      </div>
    )
  }
}
