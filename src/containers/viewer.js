import { connect } from 'react-redux'
import { setCurrentFile, setCustomSize } from '../actions'

import Viewer from '../components/viewer'

const mapStateToProps = (state, ownProps) => {
  const publicId = ownProps.match.params.public_id
    ? decodeURIComponent(ownProps.match.params.public_id)
    : undefined

  return {
    publicId,
    currentFile: state.currentFile,
    resource: state.files.find(file => file.public_id === publicId),
    customFileSize: state.customFileSize
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentFile: filename => dispatch(setCurrentFile(filename)),
  setCustomSize: data => dispatch(setCustomSize(data))
})

const WrappedViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewer)

export default WrappedViewer
