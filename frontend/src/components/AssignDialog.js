import React, { Component } from 'react'
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Share from 'material-ui-icons/Share'
import './AssignDialog.css'

const getGithubUser = id => {
  return fetch(`https://api.github.com/user/${id}`, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'Authorization': 'token ' + window.githubAccessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(response => response.json())
}

export default class AssignDialog extends Component {
  state = {
    collaborators: []
  }

  componentDidMount () {
    Promise.all(this.props.collaborators.map(getGithubUser))
      .then(collaborators => this.setState({collaborators: collaborators}))
  }

  render () {
    return (
      <div className="AssignDialog">
        <List
          subheader={<ListSubheader>Assign To:</ListSubheader>}
          >
          {this.state.collaborators.map(collaborator => (
            <ListItem
              button
              onClick={() => this.props.onAssignTo(collaborator.id.toString())}
              key={collaborator.id}
              >
              <Avatar
                alt={collaborator.login}
                src={collaborator.avatar_url}
                />
              <ListItemText primary={collaborator.login} />
            </ListItem>
          ))}
        </List>
        {this.props.onAddCollaboratorsClick && (
          <div>
            <Divider />
            <List>
              <ListItem
                button
                onClick={this.props.onAddCollaboratorsClick}
                >
                <ListItemIcon>
                  <Share />
                </ListItemIcon>
                <ListItemText primary="Add Collaborators" />
              </ListItem>
            </List>
          </div>
        )}
      </div>
    )
  }
}
