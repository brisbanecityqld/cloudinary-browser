import React from 'react'

// Components
import Button from './button'

// Styles
import styles from '../styles/search.css'

export default class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: '',
      searchType: 'name',
      focused: false
    }

    this.input = null

    // Methods
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    this._manualFocus = this._manualFocus.bind(this)
    this._submit = this._submit.bind(this)
  }

  handleChange (event) {
    this.setState({
      value: event.target.value
    })
  }

  handleKeyDown (event) {
    switch (event.key) {
      case 'Enter':
        this._submit()
        break
      case 'Escape':
        this.input.blur()
        break
      default:
        break
    }
  }

  _submit () {
    if (typeof this.props.onSubmit === 'function') {
      const type = this.state.searchType === 'name'
      this.props.onSubmit(this.state.value, type)
    }
  }

  _manualFocus () {
    setTimeout(() => this.input.focus(), 1)
  }

  handleFocus () {
    this.setState({ focused: true })

    // Call focus prop if it exists
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus()
    }
  }

  handleBlur (event) {
    this.setState({ focused: false })

    // Call blur prop if it exists
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur()
    }
  }

  render () {
    let mainStyle = this.props.isMobile ? styles.mobile : styles.main
    if (this.state.focused) {
      mainStyle += ' ' + styles.focused
    }

    return (
      <div className={mainStyle}>
        <input
          ref={input => this.input = input}
          className={styles.input}
          type="text"
          placeholder="Search..."
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur} />
        <Button icon="search" className={styles.buttonNoBg} onMouseDown={this._submit} />
        {
          (this.props.isMobile && !this.state.focused) &&
          <Button icon="search" className={styles.button} onClick={this._manualFocus} />
        }
      </div>
    )
  }
}
