/**
 * Action types
 */

const actions = {
  SET_VIEW_MODE: 'set_view_mode',
  SET_CURRENT_ROUTE: 'set_current_route',
  ADD_RESOURCES: 'add_resources',
  ADD_FOLDERS: 'add_folders',
  UPDATE_FAVOURITE: 'update_favourites',
  MARK_AS_LOADED: 'mark_as_loaded'
}

/**
 * Other constants
 */

const constants = {
  VIEW_MODES: {
    LIST: 'list',
    GRID: 'grid'
  }
}

/**
 * Action creators
 */

const creators = {
  setViewMode: function (mode) {
    const viewmode = constants.VIEW_MODES.hasOwnProperty(mode)
      ? constants.VIEW_MODES[mode]
      : constants.VIEW_MODES.LIST

    return { type: actions.SET_VIEW_MODE, viewmode }
  },

  setCurrentRoute: function (route) {
    return { type: actions.SET_CURRENT_ROUTE, route }
  },

  addResources: function (resources) {
    return { type: actions.ADD_RESOURCES, resources }
  },

  addFolders: function (folders) {
    return { type: actions.ADD_FOLDERS, folders }
  },

  updateFavourite: function (favourite, add = true) {
    return { type: actions.UPDATE_FAVOURITE, favourite, add }
  },

  markAsLoaded: function (folder, nextCursor = null) {
    return { type: actions.MARK_AS_LOADED, folder, nextCursor }
  }
}


// Export everything
export default {
  ...actions,
  ...constants,
  ...creators
}
