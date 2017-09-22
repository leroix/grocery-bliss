import React, { Component } from 'react'
import * as Network from './Network'
import './App.css'
import GroceryList from './components/GroceryList'
import Homepage from './components/Homepage'
import Layout from './components/Layout'
import GroceryListList from './components/GroceryListList'
import FriendsList from './components/FriendsList'

function shoppingListId() {
  const match = /\/shopping_lists\/(\w+)/.exec(window.location.pathname)
  return match ? match[1] : null
}


export default class App extends Component {
  constructor () {
    super()
    this.state = {
      authResponse: null
    }
  }

  componentDidMount () {
  }

  y () { return this.state.authResponse }

  profilePic () {
    const { authResponse } = this.state
    return authResponse && authResponse.picture.data.url
  }

  render () {
    return (
      <div className="App">
      {!this.state.authResponse && (
        <Homepage onFBLogin={res => this.setState({authResponse: res})} />
      )}
      {this.state.authResponse && (
        <Layout profilePicUrl={this.profilePic()}>
          {false && (
            <FriendsList
              listName={'Office Party'}
              collaborators={[]}
              onAddCollaborator={console.log}
              onRemoveCollaborator={console.log}
              />
          )}
          {false && (
            <GroceryList
              listId={this.state.listId}
              />
          )}
          {true && (
            <GroceryListList
              onShare={console.log}
              onDelete={console.log}
              onUndoDelete={console.log}
              onAddList={console.log}
              />
          )}
        </Layout>
      )}
      </div>
    );
  }
}
