import React from 'react'

// Components
import Spinner from '../spinner/spinner.jsx'
import ListView from '../listview/listview.jsx'
import GridView from '../gridview/gridview.jsx'

// Libraries
import location from '../../lib/location.js'
import API from '../../lib/api.js'

// Styles
import styles from './browser.css'

// Functional component
export default class Browser extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      files: []
    }

    this.addFiles = this.addFiles.bind(this)
    this.showError = this.showError.bind(this)
    this.updateFolder = this.updateFolder.bind(this)
  }

  addFiles (files) {
    this.setState({
      loading: false,
      error: null,
      files: []
    })
    console.dir(files)
  }

  showError (err) {
    this.setState({
      error: err.message
    })
  }

  updateFolder () {
    // Reset state
    this.setState({
      error: null,
      loading: true
    })

    // Request folder from API
    const route = location.splitRoute(this.props.location.pathname)
    const folderPath = location.getRoute(route.slice(1, route.length))
    API.getFolder(folderPath)
      .then(this.addFiles)
      .catch(this.showError)
  }

  // Lifecycle hooks
  componentWillMount () {
    this.updateFolder()
  }
  componentWillReceiveProps (nextProps) {
    const match = location.matches(this.props.location.pathname, nextProps.location.pathname)
    const error = this.state.error !== null
    if (error || !match) {
      this.updateFolder()
    }
  }

  render () {
    let inner
    if (this.state.error !== null) {
      inner = <div className={styles.error}>{this.state.error}</div>
    } else if (this.state.loading) {
      inner = <Spinner />
    } else if (this.props.viewmode === 'list') {
      inner = <ListView files={this.state.files} />
    } else {
      inner = <GridView files={this.state.files} />
    }

    return (
      <div className={styles.main}>
        {inner}
        <div>{this.props.location.pathname}</div>
      </div>
    )
  }
}
