import actions from '../actions'

const DEFAULT_STATE = {
  viewmode: actions.VIEW_MODES.LIST,
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
  [actions.SET_VIEW_MODE] (state, data) {
    return {
      ...state,
      viewmode: data.viewmode
    }
  },

  // Set the current app route
  [actions.SET_CURRENT_ROUTE] (state, data) {
    return {
      ...state,
      currentRoute: data.currentRoute
    }
  },

  // Add (or overwrite) resources
  [actions.ADD_RESOURCES] (state, data) {
    return (data.resources.length > 0)
      ? { ...state, files: merge(state.resources, data.resources, 'public_id') }
      : state
  },

  // Add (or overwrite) folders
  [actions.ADD_FOLDERS] (state, data) {
    return (data.folders.length > 0)
      ? { ...state, folders: merge(state.folders, data.folders, 'path') }
      : state
  },

  // Add or remove a favourite folder
  [actions.UPDATE_FAVOURITE] (state, data) {
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
  }
}

// Reducer
export default function (state = DEFAULT_STATE, action) {
  const type = action.type
  return (ACTIONS.hasOwnProperty(type))
    ? ACTIONS[type](state, action)
    : state
}
