import React from 'react'
import { connect } from 'react-redux'
import Browser from '../components/browser'

// Styles
import styles from '../App.css'

const mapStateToProps = (state) => {
  return {
    viewmode: state.viewmode
  }
}

const browser = props => (
  <div className={styles.content}>
    <Browser { ...props } />
  </div>
)

const WrappedBrowser = connect(
  mapStateToProps
)(browser)

export default WrappedBrowser
