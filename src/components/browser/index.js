import React from 'react'

// Components
import Spinner from '../spinner'
import ListView from '../listview'
import GridView from '../gridview'

// Libraries
import location from '../../lib/location.js'
import api from '../../lib/api.js'

// Styles
import styles from './style.css'

// Functional component
export default class Browser extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      files: []
    }

    this.update = this.update.bind(this)
    this.addFiles = this.addFiles.bind(this)
    this.setError = this.setError.bind(this)
  }

  addFiles (files) {
    this.setState({
      loading: false,
      error: null,
      files: []
    })
    console.dir(files)
  }

  // Shows an error if file loading failed
  setError (error) {
    console.error(error.message)
    this.setState({ error })
  }

  update (props = this.props) {
    // Reset state
    this.setState({
      error: null,
      loading: true
    })

    // Request folder from API
    const route = location.splitRoute(props.location.pathname)
    const folderPath = location.getAPIRoute(route)
    // api.getFiles(folderPath)
    //   .then(this.addFiles)
    //   .catch(this.setError)
  }

  // Lifecycle hooks
  componentWillMount () {
    this.update()
  }
  componentWillReceiveProps (nextProps) {
    // Check if moving to a new folder
    const match = location.matches(this.props.location.pathname, nextProps.location.pathname)
    const error = this.state.error !== null

    // Force component update
    if (error || !match) { this.update(nextProps) }
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
