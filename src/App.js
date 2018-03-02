import React from 'react';

// Components
import { Switch, Route, Redirect } from 'react-router-dom'
import DocumentTitle from 'react-document-title'

import Header from './components/header'
import Breadcrumb from './components/breadcrumb'
import Browser from './containers/browser'
import Viewer from './containers/viewer'
import Search from './containers/search'

// Libraries
import { api, location, analytics } from './lib'

// Styles
import styles from './App.css'
import shared from './styles/shared/_style.css'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      parentFolder: null,
      pageTitle: '',

      folderTreeVisible: false,
      folderTreeWidth: 300,

      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,

      hideFocus: true
    }

    // Cloudinary cloud name
    this.CLOUD_NAME = 'rosies'
    this.TITLE_SUFFIX = 'BCC Image Browser'

    this.storageKeys = [
      'folderTreeWidth'
    ]

    // Method bindings
    this.saveAppKey = this.saveAppKey.bind(this)
    this.saveAppState = this.saveAppState.bind(this)
    this.loadAppState = this.loadAppState.bind(this)

    this.setLoading = this.setLoading.bind(this)
    this.loadFolder = this.loadFolder.bind(this)
    this.loadMore = this.loadMore.bind(this)

    // Handle UI resizing
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.handleFoldersResizeEnd = this.handleFoldersResizeEnd.bind(this)

    this.toggleFolderTree = this.toggleFolderTree.bind(this)
    this.makePageTitle = this.makePageTitle.bind(this)

    // Resource loading
    this.loadResource = this.loadResource.bind(this)
    this.handleReload = this.handleReload.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handlePageLoad = this.handlePageLoad.bind(this)

    this.getRouteObject = this.getRouteObject.bind(this)

    // Errors
    this.handleAPIError = this.handleAPIError.bind(this)

    // Mobile breakpoint
    this.BREAKPOINT = 800

    // Accessibility focus ring toggle
    this.addFocusRing = this.addFocusRing.bind(this)
    this.removeFocusRing = this.removeFocusRing.bind(this)

    window.addEventListener('keydown', this.addFocusRing)
  }

  get isMobile () {
    return this.state.windowWidth < this.BREAKPOINT;
  }

  // Handle focus ring
  removeFocusRing () {
    this.setState({ hideFocus: true })
    window.removeEventListener('mousedown', this.removeFocusRing)
    window.removeEventListener('touchstart', this.removeFocusRing)
    window.addEventListener('keydown', this.addFocusRing)
  }
  addFocusRing (event) {
    if (event.key === 'Tab') {
      this.setState({ hideFocus: false })
      window.addEventListener('mousedown', this.removeFocusRing)
      window.addEventListener('touchstart', this.removeFocusRing)
      window.removeEventListener('keydown', this.addFocusRing)
    }
  }

  // Save a specific app key
  saveAppKey (key) {
    localStorage.setItem(key, JSON.stringify(this.state[key]))
  }

  // Save select parts of app state to localStorage
  saveAppState () {
    this.storageKeys.forEach(this.saveAppKey)
  }

  loadAppState () {
    const newState = {}

    this.storageKeys.forEach(key => {
      const val = localStorage.getItem(key)
      if (val) {
        try {
          newState[key] = JSON.parse(val)
        } catch (e) {
          console.log(`Error parsing stored key ${key}, deleting...`)
          localStorage.removeItem(key)
        }
      }
    })

    this.setState(newState)
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
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
  }
  handleFoldersResizeEnd (folderTreeWidth) {
    this.setState({ folderTreeWidth })
    this.saveAppState()
  }

  // Folder UI toggle for mobile devices
  toggleFolderTree () {
    this.setState(prevState => {
      return {
        folderTreeVisible: !prevState.folderTreeVisible
      }
    })
  }

  // Load the data for resource given a public ID
  async loadResource (publicId) {
    try {
      analytics.startTimer()
      const data = await api.getResource(publicId)
      analytics.recordTiming('Load single resource')

      if (data.hasOwnProperty('resources') && data.resources.length > 0) {
        this.props.addResources(data)
      } else {
        console.warn('Requested resource does not exist.')
        this.props.history.replace('/browse')
      }
    } catch (e) {
      // Loading file failed
      console.warn('Error loading resource:', e)
      this.props.history.replace('/browse')
    }
  }

  // Load all subfolders and resources for a given route (folder)
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
        // Time folder load operation
        analytics.startTimer()
        const [ resources, folders ] = await Promise.all([
          api.getResources(route),
          api.getFolders(route)
        ])
        analytics.recordTiming('Load folder content')

        // Handle failed response from server
        if (resources.errno || folders.errno) {
          throw new Error('Folder download failed; you may be offline, or may have exceeded the hourly request limit. Try again in an hour.')
        }

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
        analytics.startTimer()
        const resources = await api.getResources(path, thisRoute.nextCursor)
        analytics.recordTiming('Load next page')

        // Handle failed response from server
        if (resources.errno) {
          throw new Error('Resource download failed; you may be offline, or may have exceeded the hourly request limit. Try again in an hour.')
        }

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

  // Perform view-specific action when refresh button is pressed
  handleReload () {
    switch (this.props.appView) {
      case 'browse':
        this.loadFolder(this.props.route, true)
        // Tracking
        analytics.userRefreshedFolder(this.props.route)
        break
      case 'search':
        this.props.refreshSearch()
        // Tracking
        analytics.userRefreshedSearch(this.props.currentSearch)
        break
      default:
        break
    }
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

  // Push search URL to browser history
  handleSearch (query) {
    if (query) {
      this.props.history.push('/search/' + encodeURIComponent(query))
    }
  }

  // View-specific actions for handling page loads
  handlePageLoad (props = this.props) {
    // Handle loading different views
    const route = props.location.pathname
    const view = location.getRouteBase(route)
    this.props.setAppView(view)

    switch (view) {
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
        } else if (!props.currentFileLoaded) {
          // Resource hasn't been downloaded yet, so download it
          this.loadResource(publicId)
        }
        break

      case 'search':
        // Search screen
        const query = decodeURIComponent(route.replace('/search/', ''))
        if (query === '') {
          console.warn('No search term specified.')
          props.history.replace('/browse')
        } else {
          props.setSearch(query)
        }
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
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.handlePageLoad(nextProps)

      // On navigation anywhere, clear any checked items
      this.props.clearAllChecked()
    }

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

  // Create SEO-friendly, human-readable page title
  makePageTitle (text) {
    return text + (text !== '' ? ' | ' : '')
      + (this.props.appView ? this.props.appView.charAt(0).toUpperCase() + this.props.appView.slice(1) : '')
      + ' | ' + this.TITLE_SUFFIX
  }

  render() {
    const route = this.props.location.pathname
    const path = location.getAPIPath(route)

    const browserProps = {
      loading: this.state.loading,
      parentFolder: this.state.parentFolder,
      onScrollToBottom: () => this.loadMore(path),
      browserWidth: this.state.windowWidth - this.state.folderTreeWidth,
      folderTreeWidth: this.state.folderTreeWidth,
      folderTreeVisible: this.state.folderTreeVisible,
      onFoldersResize: this.handleFoldersResize,
      onFoldersResizeEnd: this.handleFoldersResizeEnd
    }

    const title = this.makePageTitle(
      this.props.appView === 'browse'
        ? path
        : this.props.appView === 'search'
        ? this.props.currentSearch
        : this.props.appView === 'view'
        ? this.props.currentFile
        : this.TITLE_SUFFIX
    )

    // Folders loaded
    return (
      <div className={styles.main + (this.state.hideFocus ? ' ' + shared.hideFocus : '')}>
        <DocumentTitle title={title} />
        <Header
          { ...this.props }
          isMobile={this.isMobile}
          reload={this.handleReload}
          onSearchSubmit={this.handleSearch}
          onToggleFolderTree={this.toggleFolderTree} />
        {/* Mobile breadcrumb trail */}
        {
          this.isMobile && this.props.appView === 'browse' &&
          <div className={styles.breadcrumb}><Breadcrumb route={this.props.location.pathname} /></div>
        }
        {/* App routes */}
        <Switch>
          <Route path="/browse" render={() => <Browser key="ui_browser" { ...browserProps } />} />
          <Route path="/view/:public_id" render={props => <Viewer width={this.state.windowWidth} height={this.state.windowHeight} {...props} />} />
          <Route path="/search/:query" render={() => <Search width={this.state.windowWidth} />} />
          <Redirect exact from="/*" to="/browse" />
        </Switch>
      </div>
    )
  }
}
