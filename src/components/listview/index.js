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
    const inner = (this.props.children.length > 0)
      ? this.props.children
      : <div className={styles.empty}>There are no resources in this folder.</div>

    return <div className={styles.main}>
      <FileHeader onColResize={this.handleColResize} />
      <div className={styles.scrollArea}>{inner}</div>
    </div>
  }
}
