import React from 'react'

// Components
import Tabs from '../tabs'
import Folder from '../folder'
import Draggable from '../draggable'

// Styles
import styles from './style.css'

const toPx = n => `${n}px`

export default class FolderTree extends React.Component {
  constructor (props) {
    super (props)
    console.dir(props)

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
    return folders.map(folder => {
      const isFavourite = this.isFavourite(folder)
      return <Folder key={folder.path}
                     path={folder.path}
                     name={folder.name}
                     deletable={deletable}
                     isFavourite={isFavourite}
                     onClick={() => this.props.updateFavourites({ ...folder }, !isFavourite)} />
    })
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

  displayMessage (text) {
    return <div className={styles.message}>{text}</div>
  }

  render () {
    const inline = {
      flexBasis: toPx(this.state.width)
    }

    const folders = this.makeFolders(this.props.folders)
    const favourites = this.makeFolders(this.props.favourites, true)
    let tabContent = ''
    if (this.activeTab === 'Folders') {
      tabContent = (folders.length > 0 ? folders : this.displayMessage('This folder has no subfolders.'))
    } else if (this.activeTab === 'Favourites') {
      tabContent = (favourites.length > 0 ? favourites : this.displayMessage('You haven\'t added any favourites yet.'))
    }

    return (
      <aside className={styles.main} style={inline} ref={elem => this.elem = elem}>
        <Tabs tabs={this.state.tabs} onChange={tab => this.handleTabChange(tab)}/>
        <div className={styles.scrolling}>{tabContent}</div>
        <Draggable onDrag={this.onDrag} onDragEnd={this.onDragEnd} />
      </aside>
    )
  }
}
