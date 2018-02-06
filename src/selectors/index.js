import { createSelector } from 'reselect'
import location from '../lib/location.js'

const getCurrentRoute = state => location.getAPIPath(state.currentRoute)
const getResources = state => state.files
const getFolders = state => state.folders
const getFavouritePaths = state => state.favourites

// Get all files in current folder
export const getCurrentFiles = createSelector(
  [ getCurrentRoute, getResources ],
  (path, files) => files.filter(f => f.folder === path)
)

// Get all subfolders in current folder
export const getCurrentFolders = createSelector(
  [ getCurrentRoute, getFolders ],
  (path, folders) => folders.filter(f => (
    f.path === `${path ? path + '/' : path}${f.name}`
  ))
)

// Get favourite folders
export const getFavourites = createSelector(
  [ getFolders, getFavouritePaths ],
  (folders, paths) => folders.filter(f => paths.indexOf(f.path) > -1)
)
