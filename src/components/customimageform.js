import React from 'react'
import Button from './button'
import Tooltip from './tooltip'

// CSS
import styles from '../styles/customimageform.css'

export default class CustomImageForm extends React.Component {
  constructor (props) {
    super(props)

    this.MIN = 1
    this.MAX = 10000

    this.handleNumericInput = this.handleNumericInput.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleCropClick = this.handleCropClick.bind(this)
  }

  handleNumericInput (event, target) {
    const input = event.target.value
    const newValue = parseInt(event.target.value, 10)

    if (!isNaN(newValue) && newValue < this.MAX) {
      // Limit to 4-digit numbers
      this.props.onChange({
        ...this.props.data,
        [target]: newValue
      })
    } else if (input === '') {
      // User tried to clear entire field
      this.props.onChange({
        ...this.props.data,
        [target]: ''
      })
    }
  }

  handleBlur (target) {
    // Set value to min if user leaves blank
    if (this.props.data[target] === '') {
      this.props.onChange({
        ...this.props.data,
        [target]: 1
      })
    }
  }

  handleCropClick () {
    this.props.onChange({
      ...this.props.data,
      crop: !this.props.data.crop
    })
  }

  render () {
    return (
      <div className={styles.main}>
        {/* Width input field */}
        <div className={styles.block}>
          <span className={styles.label}>Resolution</span>
          <input className={styles.input}
            type="text" value={this.props.data.width}
            onBlur={() => this.handleBlur('width')}
            onChange={e => this.handleNumericInput(e, 'width')} />

          <span className={styles.sep}>x</span>

          {/* Height input field */}
          <input className={styles.input}
            type="text" value={this.props.data.height}
            onBlur={() => this.handleBlur('height')}
            onChange={e => this.handleNumericInput(e, 'height')} />

          <span className={styles.sep}>px</span>
        </div>

        {/* Crop/scale button */}
        <div className={styles.block}>
          <span className={styles.label}>Crop mode</span>
          <Button clear className={styles.cropButton}
            icon={this.props.data.crop ? 'crop' : 'expand-arrows-alt'}
            label={this.props.data.crop ? 'Fill' : 'Stretch'} showLabel
            onClick={this.handleCropClick} />
          <Tooltip>{
            this.props.data.crop
              ? 'Fill mode: image maintains aspect ratio, but edges may be cut off.'
              : 'Stretch mode: image is stretched to exact size but may appear distorted.'
          }</Tooltip>
        </div>
      </div>
    )
  }
}
