import React from 'react'

// Components
import Tabs from './tabs'
import Folder from './folder'
import Draggable from './draggable'

// Styles
import styles from '../styles/foldertree.css'

const toPx = n => `${n}px`

export default class FolderTree extends React.Component {
  constructor (props) {
    super (props)

    this.state = {
      tabs: [
        { name: 'Folders', active: true },
        { name: 'Favourites', active: false }
      ]
    }

    this.storageKey = 'ui_filetree'
    this.saveState = this.saveState.bind(this)

    this.makeFolders = this.makeFolders.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)

    this.isFavourite = this.isFavourite.bind(this)

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  get activeTab () {
    return this.state.tabs.find(tab => tab.active).name
  }

  saveState () {
    // Store state in localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(this.state))
  }

  isFavourite (folder) {
    return this.props.favourites.findIndex(favourite => favourite.path === folder.path) > -1
  }

  // Create list of Folder components from props
  makeFolders (folders, deletable = false) {
    const subfolders = folders.map(folder => {
      const isFavourite = this.isFavourite(folder)
      return <Folder
        key={folder.path}
        path={folder.path}
        name={folder.name}
        deletable={deletable}
        isFavourite={isFavourite}
        onClick={() => {
          this.props[isFavourite ? 'removeFavourite' : 'addFavourite'](folder.path)
        }} />
    })

    const folderActions = []
    if (this.props.prevFolder !== null && this.activeTab === 'Folders') {
      folderActions.push(
        <Folder
          key={this.props.prevFolder}
          path={this.props.prevFolder}
          name="Go back"
          linkOnly />
      )
    }

    return [
      ...folderActions,
      ...subfolders
    ]
  }

  onDrag (offset) {
    this.setState((prevState, props) => ({
      width: prevState.baseWidth + offset
    }))
  }

  // Drag end
  // Pull client width of element and set as base width
  // This ensures that the element respect css min- and max-widths
  onDragEnd () {
    this.setState({
      baseWidth: this.elem.clientWidth
    }, this.saveState)
  }

  displayMessage (text) {
    return <div className={styles.message}>{text}</div>
  }

  handleTabChange (newTab) {
    this.setState((prevState, props) => {
      // Create new tabs list, where active tab name matches newTab
      const newTabs = prevState.tabs.map(tab => {
        tab.active = (tab.name === newTab)
        return tab
      })

      return { tabs: newTabs }
    }, this.saveState)
  }

  componentWillMount () {
    // Load width if it's saved in localStorage
    const state = localStorage.getItem(this.storageKey)
    if (state) {
      this.setState(JSON.parse(state))
    }
  }

  render () {
    const inline = {
      flexBasis: toPx(this.state.width)
    }

    const mainStyle = this.props.folderTreeVisible
      ? styles.main
      : styles.hidden

    const folders = this.makeFolders(this.props.folders)
    const favourites = this.makeFolders(this.props.favourites, true)
    const tabContent = (this.activeTab === 'Folders')
      ? (folders.length > 0 ? folders : this.displayMessage('This folder has no subfolders.'))
      : (this.activeTab === 'Favourites')
      ? (favourites.length > 0 ? favourites : this.displayMessage('You haven\'t added any favourites yet.'))
      : ''

    return (
      <aside className={mainStyle} style={inline} ref={elem => this.elem = elem}>
        <Tabs tabs={this.state.tabs} onChange={tab => this.handleTabChange(tab)}/>
        <div className={styles.scrolling}>{tabContent}</div>
        <Draggable onDrag={this.onDrag} onDragEnd={this.onDragEnd} />
      </aside>
    )
  }
}
