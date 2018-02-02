import {
  SET_VIEW_MODE,
  SET_CURRENT_ROUTE,
  ADD_RESOURCES,
  ADD_FOLDERS,
  UPDATE_FAVOURITE,
  MARK_AS_LOADED,
  UNLOAD_FOLDER,
  VIEW_MODES
} from '../actions'

const DEFAULT_STATE = {
  viewmode: VIEW_MODES.LIST,
  currentRoute: [],

  files: [],
  folders: [],
  favourites: [],

  loadedRoutes: []
}

// Helpers

// Merge a dataset into an existing array
function merge (source, newItems, comparisonKey) {
  const output = source.slice()

  // Iterate through each item
  for (let item of newItems) {
    // Find if item exists in output array already
    const i = output.findIndex(_ => _[comparisonKey] === item[comparisonKey])

    // If item doesn't exist push it, else overwrite it
    i === -1
      ? output.push(item)
      : Object.assign(output[i], item)
  }

  return output
}

// Actions
const ACTIONS = {
  // Set view mode
  [SET_VIEW_MODE] (state, data) {
    return {
      ...state,
      viewmode: data.viewmode
    }
  },

  // Set the current app route
  [SET_CURRENT_ROUTE] (state, data) {
    return {
      ...state,
      currentRoute: data.currentRoute
    }
  },

  // Add (or overwrite) resources
  [ADD_RESOURCES] (state, data) {
    return (data.resources.length > 0)
      ? { ...state, files: merge(state.resources, data.resources, 'public_id') }
      : state
  },

  // Add (or overwrite) folders
  [ADD_FOLDERS] (state, data) {
    return (data.folders.length > 0)
      ? { ...state, folders: merge(state.folders, data.folders, 'path') }
      : state
  },

  // Add or remove a favourite folder
  [UPDATE_FAVOURITE] (state, data) {
    const i = state.favourites.findIndex(fav => fav.path === data.path)

    // Create updated favourites list
    if (data.add && i === -1) {
      return {
        ...state,
        favourites: [ ...state.favourites.slice(), data.path ]
      }
    } else if (!data.add && i > -1) {
      return {
        ...state,
        favourites: [ ...state.favourites.slice(0, i), ...state.favourites.slice(i + 1) ]
      }
    }

    // No change
    return state
  },

  // Adds a folder to the loaded folders array
  // TODO handle next_cursor
  [MARK_AS_LOADED] (state, data) {
    if (state.loadedRoutes.indexOf(data.route) > -1) {
      return {
        ...state,
        loadedRoutes: [
          ...state.loadedRoutes,
          data.route
        ]
      }
    }

    // No change
    return state
  },

  // Unloads all files and subfolders in a folder
  [UNLOAD_FOLDER] (state, data) {
    // Filter out subfolders in folder
    const folders = state.folders.filter(folder => {
      return (
        folder.path.indexOf(data.path) !== 0 &&
        folder.path.replace(data.path, '').split('/').length !== 1
      )
    })

    // Filter out files in folder
    const files = state.files.filter(file => file.path !== data.path)

    return {
      ...state,
      files,
      folders
    }
  }
}

// Reducer
export default function (state = DEFAULT_STATE, action) {
  const type = action.type
  return (ACTIONS.hasOwnProperty(type))
    ? ACTIONS[type](state, action)
    : state
}
