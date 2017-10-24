import React from 'react'
import Avatar from 'material-ui/Avatar'

export default class UserAvatar extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  getGithubUser (id) {
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
    .then(body => this.setState({
      ownerImageUrl: body.avatar_url,
      ownerName: body.login
    }))
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
      <Avatar src={this.state.ownerImageUrl} alt={this.state.ownerName} />
    )
  }
}
