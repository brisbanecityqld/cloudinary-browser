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

    this.state = {
      baseWidth: 300,
      width: 300,
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

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  get activeTab () {
    return this.state.tabs.find(tab => tab.active).name
  }

  saveState () {
    // Store state in localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(this.state))
  }

  // Create list of Folder components from props
  makeFolders (folders, deletable = false) {
    return folders.map(folder => (
      <Folder key={folder.path}
              path={folder.path}
              name={folder.name}
              deletable={deletable}
              isFavourite={this.props.favourites.indexOf(folder.path) > -1}
              updateFavourites={this.props.updateFavourites} />
    ))
  }

  makeFavourites (folders) {
    const favourites = folders.filter(folder => {
      return this.props.favourites.indexOf(folder.path) > -1
    })

    return this.makeFolders(favourites, true)
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

  render () {
    const inline = {
      width: toPx(this.state.width)
    }

    const folders = this.makeFolders(this.props.folders)
    const favourites = this.makeFavourites(this.props.folders)
    const shown = (this.activeTab === 'Folders' ? folders : favourites)

    return (
      <aside className={styles.main} style={inline} ref={elem => this.elem = elem}>
        <Tabs tabs={this.state.tabs} onChange={tab => this.handleTabChange(tab)}/>
        <div className={styles.scrolling}>{shown}</div>
        <Draggable onDrag={this.onDrag} onDragEnd={this.onDragEnd} />
      </aside>
    )
  }
}
