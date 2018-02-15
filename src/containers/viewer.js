import { connect } from 'react-redux'

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

const WrappedViewer = connect(
  mapStateToProps
)(Viewer)

export default WrappedViewer
