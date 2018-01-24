import React from 'react'

// Components
import Button from '../button'

// Styles
import styles from './style.css'

export default class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: ''
    }

    // Methods
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({
      value: event.target.value
    })
  }

  render () {
    return (
      <div className={styles.main}>
        <input className={styles.input} type="text" placeholder="Search..." value={this.state.value} onChange={this.handleChange} />
        <Button icon="search" className={styles.button} />
      </div>
    )
  }
}
