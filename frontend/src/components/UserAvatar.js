import React from 'react'
import Avatar from 'material-ui/Avatar'

const userCache = {}

export default class UserAvatar extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  getGithubUser (id) {
    if (userCache[id]) {
        this.setState(userCache[id])
    } else {
      fetch(`https://api.github.com/user/${id}`, {
        mode: 'cors',
        method: 'GET',
        headers: {
          'Authorization': 'token ' + window.githubAccessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(body => {
        const user = {
          avatarUrl: body.avatar_url,
          username: body.login
        }
        this.setState(user)
        userCache[id] = user
      })
    }
  }

  componentDidMount () {
    if (this.props.id) {
      this.getGithubUser(this.props.id)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.id && this.props.id !== nextProps.id) {
      this.getGithubUser(nextProps.id)
    }
  }

  render () {
    return (
      <Avatar src={this.state.avatarUrl} alt={this.state.username} />
    )
  }
}
