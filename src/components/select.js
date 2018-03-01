import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import styles from '../styles/select.css'

export default class Select extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showOptions: false,
      vOffset: 0
    }

    this.dropdown = null

    this.handleChange = this.handleChange.bind(this)
    this.showOptions = this.showOptions.bind(this)
    this.hideOptions = this.hideOptions.bind(this)
    this.positionOptions = this.positionOptions.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  // Handle select change
  handleChange (event, newValue) {
    event.preventDefault()
    event.stopPropagation()

    this.props.onChange(newValue)
    this.hideOptions()
  }

  // Open dropdown
  showOptions () {
    this.setState({ showOptions: true }, this.positionOptions)
  }

  // Close dropdown
  hideOptions () {
    this.setState({ showOptions: false, vOffset: 0 })
  }

  // Handles putting the dropdown somewhere on-screen
  positionOptions () {
    if (this.dropdown) {
      // Get bounds of dropdown box
      const minAcceptable = -16
      const diff = this.dropdown.getBoundingClientRect().bottom - window.innerHeight
      if (diff > minAcceptable) {
        // Dropdown has extended beyond bottom of screen; reposition it
        this.setState({ vOffset: minAcceptable - diff })
      }
    }
  }

  handleClickOutside (event) {
    if (!this.select || !this.select.contains(event.target)) {
      this.hideOptions()
    }
  }

  // Accessible arrow keys support
  handleKeyDown (event) {
    const gotoNext = event.key === 'ArrowDown'
    const gotoPrev = event.key === 'ArrowUp'
    if (gotoPrev || gotoNext) {
      // Open dropdown if it isn't currently open
      this.showOptions()

      // Get index of current option
      const curIndex = this.props.options.findIndex(option => option.value === this.props.value)

      // Move to previous option
      if (gotoPrev && curIndex > 0) {
        this.props.onChange(this.props.options[curIndex - 1].value)
      } else if (gotoNext && curIndex < this.props.options.length - 1) {
        this.props.onChange(this.props.options[curIndex + 1].value)
      }
    } else if (event.key === 'Enter') {
      this.hideOptions()
    }
  }

  componentDidMount () {
    // window.addEventListener('click', this.handleClickOutside)
  }
  componentWillUnmount () {
    // window.removeEventListener('click', this.handleClickOutside)
  }

  // Render
  render () {
    const options = this.props.options.map(opt => (
      <div
        aria-hidden="true"
        className={styles.stackedOption}
        key={opt.value}
        style={{ opacity: this.props.value === opt.value ? 1 : 0 }}>{opt.label}</div>
    ))

    const clickableOptions = this.props.options.map(opt => {
      const selected = this.props.value === opt.value
      return (
        <div
          id={'select-option-' + opt.value} role="option" aria-selected={selected.toString()}
          className={styles.option}
          key={opt.value}
          onClick={event => this.handleChange(event, opt.value)}>
          {opt.label}
          {selected && (<div className={styles.tick}></div>)}
        </div>
      )
    })

    let selectStyle = styles[this.state.showOptions ? 'selectOpen' : 'select']
    if (this.props.className) { selectStyle += ' ' + this.props.className }

    return (
      <div
        className={selectStyle} onFocus={this.showOptions} onBlur={this.hideOptions} ref={div => this.select = div} onKeyDown={this.handleKeyDown} tabIndex="0"
        aria-label={this.props.label} aria-activedescendant={'select-option-' + this.props.value} aria-haspopup="true" aria-labelledby="select-label" aria-owns="select-dropdown" aria-expanded={this.state.showOptions.toString()}>
        {/* Dropdown icon */}
        <div className={styles.arrow}><FontAwesomeIcon icon="chevron-down" /></div>
        {/* Label options */}
        <div aria-hidden="true" className={styles.optionsVisible}>{options}</div>
        {/* Dropdown options */}
        <div
          id="select-dropdown" role="listbox" aria-labelledby="select-label"
          className={styles.optionsDropdown}
          style={{ display: this.state.showOptions ? 'block' : 'none', transform: `translateY(${this.state.vOffset}px)`}}>{clickableOptions}</div>
      </div>
    )
  }
}
