import { connect } from 'react-redux'

import Viewer from '../components/viewer'

const mapStateToProps = (state, ownProps) => {
  return {
    resource: state.files.find(file => file.public_id === decodeURIComponent(ownProps.match.params.public_id))
  }
}

const WrappedViewer = connect(
  mapStateToProps
)(Viewer)

export default WrappedViewer
