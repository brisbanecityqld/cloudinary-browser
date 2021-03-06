/**
 * Action types
 */

export const SET_VIEW_MODE      = 'set_view_mode'
export const SET_APP_VIEW       = 'set_app_view'
export const SET_CURRENT_ROUTE  = 'set_current_route'
export const ADD_RESOURCES      = 'add_resources'
export const ADD_FOLDERS        = 'add_folders'
export const UPDATE_FAVOURITE   = 'update_favourites'
export const MARK_AS_LOADED     = 'mark_as_loaded'
export const UNLOAD_FOLDER      = 'unload_folder'
export const SET_SEARCH         = 'set_search'
export const SET_SEARCH_PENDING = 'set_search_pending'
export const ADD_SEARCH_RESULTS = 'add_search_results'
export const SET_CURRENT_FILE   = 'set_current_file'
export const UPDATE_CHECKED     = 'update_checked'
export const CLEAR_ALL_CHECKED  = 'clear_all_checked'
export const SET_CUSTOM_SIZE    = 'set_custom_size'

/**
 * Other constants
 */

export const VIEW_MODES = {
  LIST: 'list',
  GRID: 'grid',
  FLEX: 'flex'
}

/**
 * Action creators
 */

export const setViewmode      = viewmode => ({ type: SET_VIEW_MODE, viewmode })
export const setAppView       = view => ({ type: SET_APP_VIEW, view })
export const setCurrentRoute  = route => ({ type: SET_CURRENT_ROUTE, route })
export const addResources     = payload => ({ type: ADD_RESOURCES, payload })
export const addFolders       = payload => ({ type: ADD_FOLDERS, payload })
export const updateFavourite  = (path, add = true) => ({ type: UPDATE_FAVOURITE, path, add })
export const markAsLoaded     = (path, nextCursor = null) => ({ type: MARK_AS_LOADED, path, nextCursor })
export const unloadFolder     = path => ({ type: UNLOAD_FOLDER, path })
export const setSearch        = search => ({ type: SET_SEARCH, search })
export const setSearchPending = pending => ({ type: SET_SEARCH_PENDING, pending })
export const addSearchResults = (results, nextCursor = null) => ({ type: ADD_SEARCH_RESULTS, results, nextCursor })
export const setCurrentFile   = filename => ({ type: SET_CURRENT_FILE, filename })
export const updateChecked    = (path, add = true) => ({ type: UPDATE_CHECKED, path, add })
export const clearAllChecked  = () => ({ type: CLEAR_ALL_CHECKED })
export const setCustomSize    = data => ({ type: SET_CUSTOM_SIZE, data })
