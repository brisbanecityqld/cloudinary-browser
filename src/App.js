import React from 'react';

// Components
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom'

import Header from './components/header/header.jsx'
import Browser from './components/browser/browser.jsx'
import Viewer from './components/viewer/viewer.jsx'

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
      viewmode: 'list'
    }
  }

  render() {
    const RoutedHeader = withRouter(props => <Header {...props} />)
    const browser = props => <Browser viewmode={this.state.viewmode} {...props} />

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
    );
  }
}
