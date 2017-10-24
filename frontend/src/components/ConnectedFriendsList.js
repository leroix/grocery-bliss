import React, { Component } from 'react'
import FriendsList from './FriendsList'
import * as Network from '../Network'

export default class ConnectedFriendsList extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    Network.getGroceryList(this.props.listId).then(list => {
      this.setState({
        collaborators: list.collaborators,
        listName: list.name
      })
    })
  }

  handleAddCollaborator = id => {
    this.setState({collaborators: this.state.collaborators.concat(id)})
    Network.addCollaborator(this.props.listId, id).then(collabs => {
      this.setState({collaborators: collabs})
    })
  }

  handleRemoveCollaborator = id => {
    this.setState({collaborators: this.state.collaborators.filter(c => c !== id)})
    Network.removeCollaborator(this.props.listId, id).then(collabs => {
      this.setState({collaborators: collabs})
    })
  }

  render () {
    return (
      <FriendsList
        listName={this.state.listName}
        collaborators={this.state.collaborators}
        onAddCollaborator={this.handleAddCollaborator}
        onRemoveCollaborator={this.handleRemoveCollaborator}
        />
    )
  }
}
