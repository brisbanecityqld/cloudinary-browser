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
      loadError: false,

      uiSizes: {
        folderTree: 300,
        browser: window.innerWidth - 300
      },

      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    // Cloudinary cloud name
    this.CLOUD_NAME = 'rosies'
    this.TITLE_SUFFIX = ' | BCC Image Browser'

    this.storageKeys = {
      'ui_column_widths': 'uiSizes'
    }

    // Method bindings
    this.saveAppKey = this.saveAppKey.bind(this)
    this.saveAppState = this.saveAppState.bind(this)
    this.loadAppState = this.loadAppState.bind(this)

    this.setLoading = this.setLoading.bind(this)
    this.loadFolder = this.loadFolder.bind(this)
    this.loadMore = this.loadMore.bind(this)

    // Handle UI resizing
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.handleFoldersResize = this.handleFoldersResize.bind(this)
    this.handleFoldersResizeEnd = this.handleFoldersResizeEnd.bind(this)

    this.getRouteObject = this.getRouteObject.bind(this)

    this.handleAPIError = this.handleAPIError.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  // Save a specific app key
  saveAppKey (key) {
    localStorage.setItem(key, JSON.stringify(this.state[this.storageKeys[key]]))
  }

  // Save select parts of app state to localStorage
  saveAppState () {
    Object.keys(this.storageKeys).forEach(key => this.saveAppKey)
  }

  loadAppState () {
    Object.entries(this.storageKeys).forEach(([ key, value ]) => {
      const val = localStorage.getItem(key)
      if (val) {
        try {
          this.setState({
            value: JSON.parse(val)
          })
        } catch (e) {
          console.log(`Error parsing stored key ${key}, deleting...`)
          localStorage.removeItem(key)
        }
      }
    })
  }

  // Mark for reload
  setLoading (loading = true) {
    this.setState({ loading })
  }

  getRouteObject (path) {
    return this.props.loadedRoutes.find(item => item.path === path)
  }

  // UI resizing
  handleWindowResize () {
    this.setState({
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }
  handleFoldersResize (newSize) {
    this.setState((prevState, props) => {
      return {
        uiSizes: {
          folderTree: newSize,
          browser: prevState.windowSize.width - newSize
        }
      }
    })
  }
  handleFoldersResizeEnd () {
    this.saveAppKey(this.storageKeys.ui_column_widths)
  }

  // Pulls the current folder from the API
  async loadFolder (route, force = false) {
    // Update route in store
    this.props.updateRoute(route)

    // If forced, remove all currently downloaded files & subfolders
    if (force) {
      this.props.unloadFolder(route)
    }

    const path = location.getAPIPath(route)
    const loaded = this.getRouteObject(path) !== undefined

    // Route not yet loaded
    if (!loaded || force) {
      this.setLoading()

      try {
        const [ resources, folders ] = await Promise.all([
          api.getResources(path),
          api.getFolders(path)
        ])

        // Add folders and resources to store
        this.props.addFolders(folders)
        this.props.addResources(resources)

        this.props.markAsLoaded(path, resources.next_cursor)
      } catch (e) {
        // Handle load errors
        console.error(e)
        this.handleAPIError(e)
      }

      this.setLoading(false)
    }
  }

  // Loads more resources for a given folder, if there are any
  async loadMore (route) {
    const path = location.getAPIPath(route)
    const thisRoute = this.getRouteObject(path)

    // Silently fail if the route isn't already loaded
    if (!thisRoute) { return }

    if (thisRoute.nextCursor !== null) {
      this.setLoading()

      try {
        const resources = await api.getResources(path, thisRoute.nextCursor)
        this.props.addResources(resources)

        // Update nextCursor
        this.props.markAsLoaded(path, resources.next_cursor)
      } catch (e) {
        // Handle load errors
        console.error(e)
        this.handleAPIError(e)
      }

      this.setLoading(false)
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

  handleSearch (term, nameSearch = true) {
    console.log('Searching', nameSearch?'names':'tags', 'for', term)
  }

  // Lifecycle hooks
  // Used for updating files and folders, and app state
  componentWillMount () {
    this.loadAppState()
    this.loadFolder(this.props.location.pathname)
  }
  componentDidMount () {
    // Bind resize listeners
    window.addEventListener('resize', this.handleWindowResize)
  }
  componentDidUpdate () {
    // Reset loading error
    if (this.state.loadError) {
      this.setState({ loadError: false })
    }
  }
  componentWillReceiveProps (nextProps) {
    // Update if we need to
    if (!location.matches(this.props.location.pathname, nextProps.location.pathname)) {
      this.loadFolder(nextProps.location.pathname)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // Probably a veeeery bad idea
    return (this.state.loading)
      ? !nextState.loading
      : true
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  render() {
    // Handle load error - redirect to /browse root
    if (this.state.loadError) {
      return <Redirect to="/browse" />
    }

    const route = this.props.location.pathname
    const path = location.getAPIPath(route)
    const thisRoute = this.getRouteObject(path)

    const browser = () => (
      <Browser onScrollToBottom={() => this.loadMore(path)}
               canLoadMore={thisRoute && thisRoute.nextCursor !== null}
               uiSizes={this.state.uiSizes}
               onFoldersResize={this.handleFoldersResize}
               onFoldersResizeEnd={this.handleFoldersResizeEnd} />
    )

    const title = (path === '' ? 'Browse' : path) + this.TITLE_SUFFIX

    // Folders loaded
    return (
      <div className={styles.main}>
        <DocumentTitle title={title} />
        <Header
          route={this.props.location.pathname}
          setViewMode={this.props.setViewMode}
          reload={() => this.loadFolder(this.props.location.pathname, true)}
          onSearchSubmit={this.handleSearch} />
        {this.state.loading ? (<Spinner />) : null}
        <Switch>
          <Route path="/browse" component={browser} />
          <Route path="/view" component={Viewer} />
          <Redirect exact from="/*" to="/browse" />
        </Switch>
      </div>
    )
  }
}
