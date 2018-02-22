import { connect } from 'react-redux'
import { setCurrentFile } from '../actions'

import Viewer from '../components/viewer'

const mapStateToProps = (state, ownProps) => {
  const publicId = ownProps.match.params.public_id
    ? decodeURIComponent(ownProps.match.params.public_id)
    : undefined

  return {
    publicId,
    resource: state.files.find(file => file.public_id === publicId)
  }
}

const mapDispatchToProps = dispatch => ({
  setCurrentFile: filename => dispatch(setCurrentFile(filename))
})

const WrappedViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Viewer)

export default WrappedViewer
