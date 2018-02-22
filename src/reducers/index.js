import {
  SET_VIEW_MODE,
  SET_APP_VIEW,
  SET_CURRENT_ROUTE,
  ADD_RESOURCES,
  ADD_FOLDERS,
  UPDATE_FAVOURITE,
  MARK_AS_LOADED,
  UNLOAD_FOLDER,
  VIEW_MODES,
  SET_SEARCH,
  ADD_SEARCH_RESULTS,
  UPDATE_CHECKED,
  CLEAR_ALL_CHECKED
} from '../actions'

const DEFAULT_STATE = {
  viewmode: VIEW_MODES.LIST,
  currentRoute: '',
  currentView: '',

  files: [],
  folders: [],
  favourites: [],
  checked: [],

  loadedRoutes: [],

  search: '',
  searchCursor: null,
  results: [],

  cloudName: 'rosies'
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
  [SET_VIEW_MODE] (state, action) {
    return {
      ...state,
      viewmode: action.viewmode
    }
  },

  // Current app view
  [SET_APP_VIEW] (state, action) {
    return {
      ...state,
      currentView: action.view
    }
  },

  // Set the current app route
  [SET_CURRENT_ROUTE] (state, action) {
    return {
      ...state,
      currentRoute: action.route
    }
  },

  // Add (or overwrite) resources
  [ADD_RESOURCES] (state, action) {
    const files = action.payload.resources
    return (files.length > 0)
      ? { ...state, files: merge(state.files, files, 'public_id') }
      : state
  },

  // Add (or overwrite) folders
  [ADD_FOLDERS] (state, action) {
    const folders = action.payload.folders
    return (folders.length > 0)
      ? { ...state, folders: merge(state.folders, folders, 'path') }
      : state
  },

  // Add or remove a favourite folder
  [UPDATE_FAVOURITE] (state, action) {
    const i = state.favourites.indexOf(action.path)
    const newFavourites = state.favourites.slice()

    // Create updated favourites list
    if (action.add && i === -1) {
      newFavourites.push(action.path)
    } else if (!action.add && i > -1) {
      newFavourites.splice(i, 1)
    }

    // No change
    return {
      ...state,
      favourites: newFavourites
    }
  },

  // Adds a folder to the loaded folders array,
  // or updates a folder's nextCursor value
  [MARK_AS_LOADED] (state, action) {
    const newRoutes = state.loadedRoutes.slice()
    const i = state.loadedRoutes.findIndex(route => route.path === action.path)

    if (i === -1) {
      // Add new route
      newRoutes.push({
        path: action.path,
        nextCursor: action.nextCursor
      })
    } else {
      // Update existing route
      newRoutes[i].nextCursor = action.nextCursor
    }

    return {
      ...state,
      loadedRoutes: newRoutes
    }
  },

  // Unloads all files and subfolders in a folder
  [UNLOAD_FOLDER] (state, action) {
    // Filter out subfolders in folder
    const folders = state.folders.filter(folder => {
      return (folder.path.indexOf(action.path) === -1)
        // Allow folders not on path
        ? true
        // Handle folders on path
        : (action.path === '')
        // Allow subfolders of base folder
        ? (folder.path.indexOf('/') > -1)
        // Allow subfolders
        : (folder.path.replace(action.path, '').split('/').length > 2)
    })

    // Filter out files in folder
    const files = state.files.filter(file => file.folder !== action.path)

    // Remove from loaded routes
    // const loadedRoutes = state.loadedRoutes.filter(route => route.path !== action.path)

    return {
      ...state,
      files,
      folders
    }
  },

  // Set the current search term
  [SET_SEARCH] (state, action) {
    return (action.search !== state.search)
      ? {
          ...state,
          search: action.search,
          searchCursor: null,
          results: []
        }
      : state
  },

  // Add search results
  [ADD_SEARCH_RESULTS] (state, action) {
    return {
      ...state,
      searchCursor: action.nextCursor,
      results: [
        ...state.results,
        ...action.results
      ]
    }
  },

  // Add or remove a favourite folder
  [UPDATE_CHECKED] (state, action) {
    const i = state.checked.indexOf(action.path)
    const newChecked = state.checked.slice()

    // Create updated favourites list
    if (action.add && i === -1) {
      newChecked.push(action.path)
    } else if (!action.add && i > -1) {
      newChecked.splice(i, 1)
    }

    // No change
    return {
      ...state,
      checked: newChecked
    }
  },

  // Remove all checked files
  // Used for check all box, and when navigating
  [CLEAR_ALL_CHECKED] (state) {
    return {
      ...state,
      checked: []
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
