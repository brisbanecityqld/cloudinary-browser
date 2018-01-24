import React from 'react';

// Components
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom'

import Header from './components/header'
import FolderTree from './components/foldertree'
import Browser from './components/browser'
import Viewer from './components/viewer'

// Styles
import styles from './App.css'

// Init FontAwesome library
import fontawesome from '@fortawesome/fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(faSolid)

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      viewmode: 'list',
      folders: [{
        name: 'browse',
        path: 'browse',
        files: null,
        subfolders: null
      }]
    }

    this.updateFolders = this.updateFolders.bind(this)
  }

  // Updates in-memory folder cache
  updateFolders (newFolders) {
    this.setState({
      folders: newFolders
    })
  }

  render() {
    const RoutedHeader = withRouter(props => <Header {...props} />)
    const browser = props => (
      <div className={styles.content}>
        <FolderTree folders={this.state.folders} updateFolders={folders => this.updateFolders(folders)} {...props} />
        <Browser viewmode={this.state.viewmode} {...props} />
      </div>
    )

    // Folders loaded
    return (
      <Router>
        <div className={styles.main}>
          <RoutedHeader />
          <Switch>
            <Route path="/browse" component={browser} />
            <Route path="/view" component={Viewer} />
            <Redirect exact from="/*" to="/browse" />
          </Switch>
        </div>
      </Router>
    )
  }
}
