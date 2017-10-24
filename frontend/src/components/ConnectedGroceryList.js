import React from 'react'
import GroceryList from './GroceryList'
import * as Network from '../Network'

export default class ConnectedGroceryList extends React.Component {
  constructor () {
    super()
    this.state = {
      groceries: [],
      collaborators: [],
      listName: '',
      owner: null,
      lastGroceryFetch: 0
    }
  }

  componentDidMount () {
    this.fetchGroceries(this.props.listId).then(update => {
      this.groceryFetchLoop()
    })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  groceryFetchLoop () {
    const fetchFrequency = 3000 // 3 seconds

    this.timeout = setTimeout(() => {
      if (Date.now() - this.state.lastGroceryFetch >= fetchFrequency) {
        this.fetchGroceries().then(() => {
          this.groceryFetchLoop()
        })
      } else {
        this.groceryFetchLoop()
      }
    }, fetchFrequency)
  }

  fetchGroceries (listId) {
    return Network.getGroceryList(listId || this.props.listId).then(list => {
      const stateUpdate = {
        groceries: list.groceries,
        collaborators: list.collaborators,
        listName: list.name,
        owner: list.owner,
        lastGroceryFetch: Date.now()
      }
      this.setState(stateUpdate)
      return stateUpdate
    })
  }

  handleAddItem = (itemDescription) => {
    const { groceries } = this.state
    const { listId } = this.props
    const tempItem = {id: Math.random().toString(), name: itemDescription}

    // save an item with a temporary id until we get the response back from the server
    this.setState({
      groceries: groceries.concat(tempItem)
    })

    // once we get the response back from the server we can replace the
    // temporary id
    Network.addGroceryItem(listId, {name: itemDescription}).then(savedItem => {
      const groceries = this.state.groceries.slice()
      const item = groceries.find(it => it.id === tempItem.id)
      item.id = savedItem.id
      this.setState({
        groceries: groceries
      })
    })
  }

  handleAssignTo = (name, itemIds) => {
    const { groceries } = this.state
    const { listId } = this.props
    const shouldAssign = item => itemIds.indexOf(item.id) > -1

    this.setState({
      groceries: groceries.map(item => {
        return Object.assign(
          item,
          shouldAssign(item) ? {assigned_to: name} : {}
        )
      })
    })

    Network.updateGroceryItems(listId, groceries.filter(shouldAssign))
  }

  handleToggleObtained = itemIds => {
    const { groceries } = this.state
    const { listId } = this.props
    const shouldToggle = item => itemIds.indexOf(item.id) > -1

    this.setState({
      groceries: groceries.map(item => {
        return Object.assign(
          item,
          {obtained: shouldToggle(item) ? !item.obtained : item.obtained}
        )
      })
    })

    Network.updateGroceryItems(
      listId,
      groceries.filter(shouldToggle)
    )
  }

  handleRemoveItems = itemIds => {
    const { groceries } = this.state
    const { listId } = this.props

    this.setState({
      groceries: groceries.filter(item => itemIds.indexOf(item.id) === -1)
    })

    Network.deleteGroceryItems(listId, itemIds)
  }

  render () {
    return (
      <GroceryList
        user={this.props.user}
        owner={this.state.owner}
        listName={this.state.listName}
        groceryItems={this.state.groceries}
        collaborators={this.state.collaborators}
        onAssignTo={this.handleAssignTo}
        onToggleObtained={this.handleToggleObtained}
        onRemoveItems={this.handleRemoveItems}
        onAddItem={this.handleAddItem}
        onAddCollaboratorsClick={this.props.onAddCollaboratorsClick}
        />
    )
  }
}
