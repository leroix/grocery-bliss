import React from 'react'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'
import './FriendsList.css'

export default class FriendsList extends React.Component {
  constructor () {
    super()

    this.state = {
      followers: []
    }
  }

  componentDidMount () {
    fetch(`https://api.github.com/user/followers?per_page=100`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Authorization': 'token ' + window.githubAccessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(followers => this.setState({
      followers: followers
    }))
  }

  isCollaborator (githubUser) {
    return this.props.collaborators.indexOf(githubUser.id.toString()) > -1
  }

  toggleCollaborator = (githubUser) => {
    const { onAddCollaborator, onRemoveCollaborator } = this.props
    this.isCollaborator(githubUser)
      ? onRemoveCollaborator(githubUser.id.toString())
      : onAddCollaborator(githubUser.id.toString())
  }

  compareFollowers = (f1, f2) => {
    if (this.isCollaborator(f1) && !this.isCollaborator(f2)) {
      return -1
    }

    if (!this.isCollaborator(f1) && this.isCollaborator(f2)) {
      return 1
    }

    return f1.login.localeCompare(f2.login)
  }

  render() {
    const { listName } = this.props

    return (
      <div className="FriendsList">
        <Toolbar className="FriendsList__Title">
          <Typography type="body2">
            Share "{listName}" with any of your GitHub followers:
          </Typography>
        </Toolbar>
        <List>
          {this.state.followers.slice().sort(this.compareFollowers).map(follower => (
            <ListItem key={follower.id} dense button onClick={() => this.toggleCollaborator(follower)}>
              <Avatar alt={follower.login} src={follower.avatar_url} />
              <ListItemText primary={follower.login} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={() => this.toggleCollaborator(follower)}
                  checked={this.isCollaborator(follower)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    )
  }
}
