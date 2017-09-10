import React, { Component } from 'react'
import * as Network from './Network'
import './App.css'
import GroceryList from './components/GroceryList'

function shoppingListId() {
  const match = /\/shopping_lists\/(\w+)/.exec(window.location.pathname)
  return match ? match[1] : null
}


class App extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount() {
    const id = shoppingListId()

    if (id) {
      this.fetchGroceries(id).then(update => {
        this.setState({listId: id})
        this.groceryFetchLoop()
      })
    } else {
      Network.createList().then(id => {
        window.location.href = `/shopping_lists/${id}`
      })
    }
  }

  groceryFetchLoop() {
    const fetchFrequency = 3000 // 3 seconds

    setTimeout(() => {
      if (Date.now() - this.state.lastGroceryFetch >= fetchFrequency) {
        this.fetchGroceries().then(() => {
          this.groceryFetchLoop()
        })
      } else {
        this.groceryFetchLoop()
      }
    }, fetchFrequency)
  }

  fetchGroceries(listId) {
    return Network.getGroceries(listId || this.listId).then(g => {
      const stateUpdate = {groceries: g, lastGroceryFetch: Date.now()}
      this.setState(stateUpdate)
      return stateUpdate
    })
  }

  handleAddItem = (itemDescription) => {
    const { groceries, listId } = this.state
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
    const { groceries, listId } = this.state

    this.setState({
      groceries: groceries.map(item => {
        return Object.assign(
          item,
          itemIds.indexOf(item.id) > -1 ? {assigned_to: name} : {}
        )
      })
    })

    itemIds.forEach(itemId => {
      Network.updateGroceryItem(listId, itemId, {assigned_to: name})
    })
  }

  handleToggleObtained = itemIds => {
    const { groceries, listId } = this.state
    const shouldToggle = item => itemIds.indexOf(item.id) > -1
    this.setState({
      groceries: groceries.map(item => {
        return Object.assign(
          item,
          {obtained: shouldToggle(item) ? !item.obtained : item.obtained}
        )
      })
    })

    itemIds.forEach(itemId => {
      const item = groceries.find(item => item.id === itemId)
      Network.updateGroceryItem(listId, itemId, item)
    })
  }

  handleRemoveItems = itemIds => {
    const { groceries, listId } = this.state

    this.setState({
      groceries: groceries.filter(item => itemIds.indexOf(item.id) === -1)
    })

    itemIds.forEach(itemId => {
      Network.deleteGroceryItem(listId, itemId)
    })
  }

  render() {
    return (
      <div className="App">
        <GroceryList
          groceryItems={this.state.groceries}
          onAddItem={this.handleAddItem}
          onAssignTo={this.handleAssignTo}
          onToggleObtained={this.handleToggleObtained}
          onRemoveItems={this.handleRemoveItems}
          />
      </div>
    );
  }
}

export default App;
