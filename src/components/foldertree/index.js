import React from 'react'

// Components
import { Redirect } from 'react-router-dom'

// Libraries
import api from '../../lib/api.js'
import location from '../../lib/location.js'

// Styles
import styles from './style.css'

export default class FolderTree extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      folders: [],
      error: null
    }

    this.subfoldersAreDownloaded = this.subfoldersAreDownloaded.bind(this)
    this.update = this.update.bind(this)
    this.setError = this.setError.bind(this)
  }

  // Returns true if folders has been checked for subfolders already
  subfoldersAreDownloaded (route) {
    let folders = this.props.folders

    let currentFolder = folders
    let nextIndex

    const length = route.length
    for (let i = 0; i < length - 1; i++) {
      // Find next folder in path
      nextIndex = currentFolder.findIndex(_ => _.name === route[i])

      if (nextIndex > -1 || currentFolder[nextIndex].subfolders === null) {
        // Folder along path can't be found, or
        // folder was found and contains no subfolders
        return false
      }

      // Move into next folder
      currentFolder = currentFolder[nextIndex].subfolders
    }

    return true
  }

  updateFolders (route, newFolders) {
  }

  // Sets error if something went wrong with request
  setError (error) {
    console.error(error.message)
    this.setState({ error })
  }

  // Update folders listing for current (sub)folder
  update (props = this.props) {
    // Reset state
    this.setState({ error: null })

    const route = location.splitRoute(props.location.pathname)

    // Check if subfolders already downloaded
    if (this.subfoldersAreDownloaded(route)) {

    }
    api.getFolders(location.getAPIRoute(route))
      .then(folders => {
        // Parse and update folders
        this.updateFolders(folders)
      })
      .catch(this.setError)
  }

  // Lifecycle hooks
  componentWillMount () {
    this.update()
  }
  componentWillReceiveProps (nextProps) {
    // Check if moving to a new folder
    console.log('current:',this.props.location.pathname,', next:', nextProps.location.pathname)
    const match = location.matches(this.props.location.pathname, nextProps.location.pathname)
    const error = this.state.error !== null

    // Force component update
    if (error || !match) { this.update(nextProps) }
  }

  render () {
    const err = this.state.error
    if (err && err.hasOwnProperty('http_code') && err.http_code === 404) {
      // Subfolder not found
      return <Redirect to="/browse" />
    } else {
      // Render all subfolders of current folder
      return (
        <aside className={styles.main}>

        </aside>
      )
    }
  }
}
