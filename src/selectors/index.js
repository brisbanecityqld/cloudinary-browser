import { createSelector } from 'reselect'

const getCurrentRoute = state => state.currentRoute
const getResources = state => state.files
const getFolders = state => state.folders
const getFavouritePaths = state => state.favourites
const getLoadedRoutes = state => state.loadedRoutes
const getChecked = state => state.checked

// Get all files in current folder
export const getCurrentFiles = createSelector(
  [ getCurrentRoute, getResources ],
  (path, files) => files.filter(f => f.folder === path)
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
  [ getFolders, getFavouritePaths ],
  (folders, paths) => folders.filter(f => paths.indexOf(f.path) > -1)
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
  [ getCurrentFiles, getChecked ],
  (files, checked) => {
    // Fail if no files loaded or nothing checked
    if (files.length === 0 || checked.length === 0) return false

    // Check each loaded file is checked
    for (let f of files) {
      if (checked.indexOf(f.public_id) === -1) return false
    }
    return true
  }
)
