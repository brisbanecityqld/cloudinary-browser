import React from 'react';

// Components
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/header/header.jsx'
import Browser from './components/browser/browser.jsx'
import Viewer from './components/viewer/viewer.jsx'

// Styles
// import styles from './App.css';

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
    return (
      <Router>
        <div>
          <Route path="/" component={Header} />
          <Route path="/browse" component={Browser} />
          <Route path="/view" component={Viewer} />
        </div>
      </Router>
    );
  }
}
