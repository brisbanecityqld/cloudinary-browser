import React from 'react';

// Components
import { Switch, Route, Redirect } from 'react-router-dom'
import DocumentTitle from 'react-document-title'

import Header from './components/header'
import Spinner from './components/spinner'

import Browser from './containers/browser'
import Viewer from './containers/viewer'

// Libraries
import { api, location } from './lib'

// Styles
import styles from './App.css'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      parentFolder: null,
      folderTreeVisible: false,

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

    this.toggleFolderTree = this.toggleFolderTree.bind(this)

    this.loadResource = this.loadResource.bind(this)
    this.viewResource = this.viewResource.bind(this)

    this.getRouteObject = this.getRouteObject.bind(this)

    this.handleAPIError = this.handleAPIError.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.doSearch = this.doSearch.bind(this)

    this.handlePageLoad = this.handlePageLoad.bind(this)

    // Mobile breakpoint
    this.BREAKPOINT = 800
  }

  get isMobile () {
    return this.state.windowSize.width < this.BREAKPOINT;
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

  toggleFolderTree () {
    this.setState(prevState => {
      return {
        folderTreeVisible: !prevState.folderTreeVisible
      }
    })
  }

  async loadResource (publicId) {
    const data = await api.getResource(publicId)
    if (data.hasOwnProperty('resources') && data.resources.length > 0) {
      this.props.addResources(data)
    } else {
      console.warn('Requested resource does not exist.')
      this.props.history.replace('/browse')
    }
  }

  // Pulls the current folder from the API
  async loadFolder (route, force = false) {
    this.props.updateRoute(route)

    // If forced, remove all currently downloaded files & subfolders
    if (force) {
      this.props.unloadFolder(route)
    }

    const loaded = this.getRouteObject(route) !== undefined

    // Route not yet loaded
    if (!loaded || force) {
      this.setLoading()

      try {
        const [ resources, folders ] = await Promise.all([
          api.getResources(route),
          api.getFolders(route)
        ])

        // Add folders and resources to store
        this.props.addFolders(folders)
        this.props.addResources(resources)

        this.props.markAsLoaded(route, resources.next_cursor)
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

  // Reroute to file viewer
  viewResource (publicId) {
    this.props.history.push('/view/' + publicId, { canGoBack: true })
  }

  // Handles some API errors
  handleAPIError (error) {
    if (error.hasOwnProperty('http_code') && error.http_code === 404) {
      // Handle attempting to load a non-existant folder
      this.props.history.replace('/browse')
    } else {
      // Other errors
      console.error(error.message)
    }
  }

  handleSearch (query, nameSearch = true) {
    if (query) {
      console.log('Searching', nameSearch ? 'names' : 'tags', 'for', query)
      this.props.history.push('/search?q=' + query)
    }
  }

  // TODO
  async doSearch (query) {
    try {
      const results = await api.search(query)
      console.log(results)
    } catch (e) {
      console.error(e)
    }
  }

  handlePageLoad (props = this.props) {
    // Handle loading different views
    const route = props.location.pathname

    switch (location.getRouteBase(route)) {
      // File browser
      case 'browse':
        this.loadFolder(location.getAPIPath(route))

        // Close folder tree on mobile
        if (this.state.folderTreeVisible) {
          this.toggleFolderTree()
        }
        break

      case 'view':
        // Single file viewer
        const publicId = decodeURIComponent(route.replace('/view/', ''))
        if (publicId === '') {
          // A resource wasn't actually requested
          console.warn('No resource requested to view.')
          props.history.replace('/browse')
        } else {
          // Resource hasn't been downloaded yet, so download it
          this.loadResource(publicId)
        }
        break

      case 'search':
        // Search screen
        break

      default:
        console.warn('Invalid URL:', route)
        break
    }
  }

  // Lifecycle hooks
  // Used for updating files and folders, and app state
  componentWillMount () {
    this.loadAppState()
    this.handlePageLoad()
  }

  componentDidMount () {
    // Bind resize listeners
    window.addEventListener('resize', this.handleWindowResize)
  }
  componentWillReceiveProps (nextProps) {
    // Update if we need to
    this.handlePageLoad(nextProps)

    // Set previous folder (for going back)
    const path = location.splitRoute(nextProps.location.pathname)
    const parentFolder = path.length > 1
      ? location.getAPIPath(path.slice(0, path.length - 1))
      : null

    if (this.state.parentFolder !== parentFolder) {
      this.setState({ parentFolder })
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  render() {
    const route = this.props.location.pathname
    const base = location.getRouteBase(route)
    const path = location.getAPIPath(route)
    const thisRoute = this.getRouteObject(path)

    const browserProps = {
      parentFolder: this.state.parentFolder,
      onScrollToBottom: () => this.loadMore(path),
      onResourceClick: this.viewResource,
      canLoadMore: thisRoute && thisRoute.nextCursor !== null,
      uiSizes: this.state.uiSizes,
      folderTreeVisible: this.state.folderTreeVisible,
      onFoldersResize: this.handleFoldersResize,
      onFoldersResizeEnd: this.handleFoldersResizeEnd
    }

    const title = (path === '' ? 'Browse' : path) + this.TITLE_SUFFIX

    // Folders loaded
    return (
      <div className={styles.main}>
        <DocumentTitle title={title} />
        <Header
          { ...this.props }
          isMobile={this.isMobile}
          reload={() => this.loadFolder(this.props.location.pathname, true)}
          onSearchSubmit={this.handleSearch}
          onToggleFolderTree={this.toggleFolderTree} />
        <Switch>
          <Route path="/browse" render={() => <Browser key="ui_browser" { ...browserProps } />} />
          <Route path="/view/:public_id" component={Viewer} />
          <Redirect exact from="/*" to="/browse" />
        </Switch>
        {this.state.loading && base !== 'view' && <Spinner />}
      </div>
    )
  }
}
