import React from 'react'

// Styles
import styles from './style.css'

// Required props:
//  - onDrag (function, return current offset from drag start)
//  - onDragEnd (function)

export default class Draggable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dragging: false,
      dragStart: 0
    }

    this.startDrag = this.startDrag.bind(this)
    this.whileDrag = this.whileDrag.bind(this)
    this.stopDrag = this.stopDrag.bind(this)
  }

  startDrag (event) {
    event.preventDefault()

    // Start drag
    this.setState({
      dragging: true,
      dragStart: event.clientX
    })
  }

  whileDrag (event) {
    if (this.state.dragging) {
      event.preventDefault()

      // Call update method to update parent
      this.props.onDrag(event.clientX - this.state.dragStart)

      return false
    }
  }

  stopDrag (event) {
    if (this.state.dragging) {
      this.setState({
        dragging: false
      })

      // Call end method to set parent width
      this.props.onDragEnd()
    }
  }

  // Lifecycle hooks
  componentWillMount () {
    window.addEventListener('mousemove', this.whileDrag)
    window.addEventListener('mouseup', this.stopDrag)
  }
  componentWillUnmount () {
    window.removeEventListener('mousemove', this.whileDrag)
    window.removeEventListener('mouseup', this.stopDrag)
  }

  render () {
    return (
      <div className={styles.main}
           onMouseDown={this.startDrag}
           >
      </div>
    )
  }
}
