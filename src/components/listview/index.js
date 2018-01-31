import React from 'react'

// Components
import FileHeader from '../fileheader'

// Styles
import styles from './style.css'

export default class ListView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      columnWidths: null
    }

    this.handleColResize = this.handleColResize.bind(this)
  }

  handleColResize (columns) {
    console.log(columns)
  }

  render () {
    return <div className={styles.main}>
      <FileHeader onColResize={this.handleColResize} />
      {this.props.children}
    </div>
  }
}
