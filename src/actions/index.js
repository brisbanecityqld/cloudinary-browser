/**
 * Action types
 */

export const SET_VIEW_MODE = 'set_view_mode'
export const SET_CURRENT_ROUTE = 'set_current_route'
export const ADD_RESOURCES = 'add_resources'
export const ADD_FOLDERS = 'add_folders'
export const UPDATE_FAVOURITE = 'update_favourites'
export const MARK_AS_LOADED = 'mark_as_loaded'
export const UNLOAD_FOLDER = 'unload_folder'

/**
 * Other constants
 */

export const VIEW_MODES = {
  LIST: 'list',
  GRID: 'grid'
}

/**
 * Action creators
 */

export function setViewMode (mode) {
  const viewmode = VIEW_MODES.hasOwnProperty(mode)
    ? VIEW_MODES[mode]
    : VIEW_MODES.LIST

  return { type: SET_VIEW_MODE, viewmode }
}

export function setCurrentRoute (route) {
  return { type: SET_CURRENT_ROUTE, route }
}

export function addResources (resources) {
  return { type: ADD_RESOURCES, resources }
}

export function addFolders (folders) {
  return { type: ADD_FOLDERS, folders }
}

export function updateFavourite (path, add = true) {
  return { type: UPDATE_FAVOURITE, path, add }
}

export function markAsLoaded (path, nextCursor = null) {
  return { type: MARK_AS_LOADED, path, nextCursor }
}

export function unloadFolder (path) {
  return { type: UNLOAD_FOLDER, path }
}
