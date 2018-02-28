import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import styles from '../styles/select.css'

export default class Select extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showOptions: false
    }

    this.div = null

    this.handleChange = this.handleChange.bind(this)
    this.showOptions = this.showOptions.bind(this)
    this.hideOptions = this.hideOptions.bind(this)
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
    this.setState({ showOptions: true })
  }

  // Close dropdown
  hideOptions () {
    this.setState({ showOptions: false })
  }

  handleClickOutside (event) {
    if (!this.select || !this.select.contains(event.target)) {
      this.hideOptions()
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.handleClickOutside)
  }
  componentWillUnmount () {
    window.removeEventListener('click', this.handleClickOutside)
  }

  // Render
  render () {
    const options = this.props.options.map(opt => (
      <div className={styles.option} key={opt.value}>{opt.label}</div>
    ))

    const clickableOptions = this.props.options.map(opt => {
      return (
        <div className={styles.option} key={opt.value} onClick={event => this.handleChange(event, opt.value)}>
          {opt.label}
          {this.props.value === opt.value && (<div className={styles.tick}></div>)}
        </div>
      )
    })

    // Work out margin for visible options
    const currentIndex = this.props.options.findIndex(op => op.value === this.props.value)
    const style = { marginTop: currentIndex * -2.25 + 'em' }

    const optionsVisible = (<div className={styles.optionsVisible} style={style}>{options}</div>)
    const optionsDropdown = (<div className={styles.optionsDropdown}>{clickableOptions}</div>)

    let selectStyle = styles[this.state.showOptions ? 'selectOpen' : 'select']
    if (this.props.className) { selectStyle += ' ' + this.props.className }

    return (
      <div className={selectStyle} onClick={this.showOptions} ref={div => this.select = div}>
        <div className={styles.arrow}><FontAwesomeIcon icon="chevron-down" /></div>
        { optionsVisible }
        { this.state.showOptions && optionsDropdown }
      </div>
    )
  }
}
