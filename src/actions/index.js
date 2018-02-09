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

export function setViewMode (viewmode) {
  return { type: SET_VIEW_MODE, viewmode }
}

export function setCurrentRoute (route) {
  return { type: SET_CURRENT_ROUTE, route }
}

export function addResources (payload) {
  return { type: ADD_RESOURCES, payload }
}

export function addFolders (payload) {
  return { type: ADD_FOLDERS, payload }
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
