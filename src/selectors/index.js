import { createSelector } from 'reselect'

const getAppView = state => state.currentView
const getCurrentRoute = state => state.currentRoute
const getResources = state => state.files
const getSearchResults = state => state.results
const getFolders = state => state.folders
const getFavouritePaths = state => state.favourites
const getLoadedRoutes = state => state.loadedRoutes
const getChecked = state => state.checked

// Helpers

// Sort two resources based on their public_ids
function cloudinarySort (a, b, key) {
  return a.public_id === b.public_id
    ? 0
    : a.public_id < b.public_id
    ? -1
    : 1
}

// Folder sort
function folderSort (a, b) {
  return a.name.localeCompare(b.name)
}

// Extracts a folder's name from its path
function getFolderName (path) {
  const sepIndex = path.lastIndexOf('/')
  return sepIndex > -1
    ? path.slice(sepIndex + 1)
    : path
}

// Get all files in current folder
export const getCurrentFiles = createSelector(
  [ getCurrentRoute, getResources ],
  (path, files) => files.filter(f => f.folder === path).sort(cloudinarySort)
)

// Get all subfolders in current folder
export const getCurrentFolders = createSelector(
  [ getCurrentRoute, getFolders ],
  (path, folders) => folders.filter(f => (
    f.path === (path ? path + '/' + f.name : f.name)
  ))
)

// Get favourite folders
export const getFavourites = createSelector(
  [ getFavouritePaths ],
  paths => paths.map(path => ({ path, name: getFolderName(path) })).sort(folderSort)
)

export const getNextCursor = createSelector(
  [ getCurrentRoute, getLoadedRoutes ],
  (path, routes) => {
    const current = routes.find(route => route.path === path)
    return current
      ? current.nextCursor
      : null
  }
)

export const areAllFilesChecked = createSelector(
  [ getAppView, getCurrentFiles, getSearchResults, getChecked ],
  (view, currFiles, searchFiles, checked) => {
    const files = (view === 'search' ? searchFiles : currFiles)

    // Fail if no files loaded or nothing checked
    if (files.length === 0 || checked.length === 0) return false

    // Check each loaded file is checked
    for (let f of files) {
      if (checked.indexOf(f.public_id) === -1) return false
    }
    return true
  }
)
