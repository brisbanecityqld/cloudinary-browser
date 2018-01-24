// Helpers for modifying files and folders returned from the Cloudinary API

function addType (item, type) {
  return { ...item, resource_type: type }
}

function setAsFolders (array) {
  return array.map(item => addType(item, 'folder'))
}

export default {
  setAsFolders
}
