import { VIEW_MODES } from './actions'

const DEFAULT_STATE = {
  viewmode: VIEW_MODES.GRID,
  currentRoute: '',
  currentView: '',
  currentFile: '',

  files: [],
  folders: [],
  favourites: [],
  checked: [],

  loadedRoutes: [],

  search: '',
  searchPending: false,
  searchCursor: null,
  results: [],

  customFileSize: {
    width: 600,
    height: 400,
    crop: true
  }
}

// State properties to persist
const PERSIST_KEYS = [
  'viewmode',
  'favourites',
  'customFileSize'
]

function getPersistedState () {
  const vals = {}

  for (let k of PERSIST_KEYS) {
    // Get value of key from localStorage
    const val = localStorage.getItem(k)
    if (k && JSON.parse(val)) {
      try {
        // Try and parse value
        vals[k] = JSON.parse(val)
      } catch (e) {
        // Key is broken or corrupt
        console.warn('localStorage key ' + k + ' is corrupt, deleting...')
        localStorage.removeItem(k)
      }
    }
  }

  return vals
}

export function getDefaultState () {
  const persistedState = getPersistedState()
  return Object.assign(DEFAULT_STATE, persistedState)
}

// Persists relevant keys in a given store
export function persist (store) {
  store.subscribe(() => {
    // Get state after change
    const state = store.getState()

    // Persist keys to localStorage
    for (let k of PERSIST_KEYS) {
      if (state.hasOwnProperty(k)) {
        localStorage.setItem(k, JSON.stringify(state[k]))
      }
    }
  })
}
