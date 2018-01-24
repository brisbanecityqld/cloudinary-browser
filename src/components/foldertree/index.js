import React from 'react'

// Components
import { Redirect } from 'react-router-dom'

// Libraries
import api from '../../lib/api.js'
import location from '../../lib/location.js'

// Styles
import styles from './foldertree.css'

export default class FolderTree extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      error: null
    }

    this.folderIsDownloaded = this.folderIsDownloaded.bind(this)
    this.update = this.update.bind(this)
    this.setError = this.setError.bind(this)
  }

  // Returns true if folders has been checked for subfolders already
  folderIsDownloaded (route) {
    let folders = this.props.folders
    let currentFolder = folders

    const length = route.length
    const target = route[length - 1]

    if (length === 1) {
      return
    }
    let nextIndex

    route.forEach(folder => {
      nextIndex = currentFolder.findIndex(_ => _.name === folder)

      // Can't find next folder, or
      // next folder's subfolders aren't downloaded yet
      if (nextIndex === -1 || currentFolder[nextIndex].subfolders === null) {
        return false
      }

      currentFolder = currentFolder[nextIndex].subfolders
    })

    // Folder is already downloaded
    return true
  }

  updateFolders (route, newFolders) {
    let folders = this.props.folders

    if (route.length === 1) {
      // Handle base folder
      return folders[0].subfolders !== null
    } else {
      // Traverse folder tree to desired subfolder
      // Add more if we can't continue
      const path = route.slice(0, route.length - 1)
      const target = route[route.length - 1]

      let currentFolder = folders
      let nextIndex

      path.forEach(folder => {
        nextIndex = currentFolder.findIndex(_ => _.name === folder)
        if (nextIndex > -1) {
          // Found the next folder
          currentFolder = currentFolder[nextIndex].subfolders
        } else {
          // Folder doesn't exist in path, create it

        }
      })
    }
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
