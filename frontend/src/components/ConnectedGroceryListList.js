import React, { Component } from 'react'
import * as Network from '../Network'
import GroceryListList from './GroceryListList'

export default class ConnectedGroceryListList extends Component {
  constructor () {
    super()
    this.state = {
      lists: [],
      lastGroceryListsFetch: 0
    }
  }

  componentDidMount () {
    this.fetchGroceryLists().then(lists => {
      this.groceryListsFetchLoop()
    })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  groceryListsFetchLoop () {
    const fetchFrequency = 3000

    this.timeout = setTimeout(() => {
      if (Date.now() - this.state.lastGroceryListsFetch >= fetchFrequency) {
        this.fetchGroceryLists().then(() => {
          this.groceryListsFetchLoop()
        })
      } else {
        this.groceryListsFetchLoop()
      }
    }, fetchFrequency)
  }

  fetchGroceryLists () {
    return Network.getGroceryLists().then(lists => {
      this.setState({lists: lists})
      return lists
    })
  }

  resolveListId = tempId => savedList => {
    const lists = this.state.lists.slice()
    const list = lists.find(l => l.id === tempId)
    list.id = savedList.id
    this.setState({lists: lists})
  }

  handleAddList = name => {
    const tempId = Math.random().toString()
    const newList = {
      name: name,
      created: Date.now(),
      owner: this.props.user
    }

    this.setState({
      lists: this.state.lists.concat(
        Object.assign({}, newList, {id: tempId})
      )
    })

    Network.addGroceryList(newList).then(this.resolveListId(tempId))
  }

  handleDelete = id => {
    this.setState({
      lists: this.state.lists.filter(l => l.id !== id)
    })

    Network.getGroceryList(id).then(list => {
      this.lastDeletedList = list
    }).then(() => {
      return Network.deleteGroceryList(id)
    })
  }

  handleUndoDelete = () => {
    this.setState({
      lists: this.state.lists.concat(this.lastDeletedList)
    })

    Network.addGroceryList(this.lastDeletedList).then(this.resolveListId(this.lastDeletedList.id))
  }

  render () {
    return (
      <GroceryListList
        groceryLists={this.state.lists}
        user={this.props.user}
        onAddList={this.handleAddList}
        onListClick={this.props.onListClick}
        onShareClick={this.props.onShareClick}
        onDeleteClick={this.handleDelete}
        onUndoDeleteClick={this.handleUndoDelete}
        />
    )
  }
}
