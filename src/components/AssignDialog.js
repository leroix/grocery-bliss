import React, { Component } from 'react'
import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Share from 'material-ui-icons/Share'
import './AssignDialog.css'

const getFbUser = id => {
  return new Promise(resolve => {
    window.FB.api(`/${id}?fields=name,picture`, resolve)
  })
}

export default class AssignDialog extends Component {
  state = {
    collaborators: []
  }

  componentDidMount () {
    Promise.all(this.props.collaborators.map(getFbUser))
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
              onClick={() => this.props.onAssignTo(collaborator.id)}
              key={collaborator.id}
              >
              <Avatar
                alt={collaborator.name}
                src={collaborator.picture.data.url}
                />
              <ListItemText primary={collaborator.name.split(' ')[0]} />
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
