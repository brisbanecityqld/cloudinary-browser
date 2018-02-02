import { createSelector } from 'reselect'
import location from './lib/location.js'

const getCurrentRoute = state => location.getAPIPath(state.currentRoute)
const getResources = state => state.resources
const getFolders = state => state.folders
const getFavouritePaths = state => state.favourites

export default {
  // Get all files in current folder
  getCurrentFiles: createSelector(
    [ getCurrentRoute, getResources ],
    (path, files) => files.filter(f => f.folder === path)
  ),

  // Get all subfolders in current folder
  getCurrentFolders: createSelector(
    [ getCurrentRoute, getFolders ],
    (path, folders) => folders.filter(f => (
      f.path === `${path ? path : path + '/'}${f.name}`
    ))
  ),

  // Get favourite folders
  getFavourites: createSelector(
    [ getFolders, getFavouritePaths ],
    (folders, paths) => folders.filter(f => paths.indexOf(f.path) > -1)
  )
}
