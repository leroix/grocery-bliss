import React, { Component } from 'react'
import './App.css'
import ConnectedGroceryList from './components/ConnectedGroceryList'
import ConnectedFriendsList from './components/ConnectedFriendsList'
import ConnectedGroceryListList from './components/ConnectedGroceryListList'
import Homepage from './components/Homepage'
import Layout from './components/Layout'
import * as Network from './Network'

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      authResponse: null
    }
  }

  historyPush (path) {
    window.history.pushState({}, null, path)
    this.setState({path: path})
  }

  componentDidMount () {
    const code = (window.location.href.match(/(?:code)=([\S\s]*?)&/) || [])[1]

    if (!this.state.authResponse) {
      this.historyPush('/')
    }

    window.addEventListener('popstate', this.handlePopstate)

    if (code) {
      this.setState({loggingIn: true})
      Network.login(code).then(authResponse => {
        if (authResponse) {
          this.setState({
            authResponse: authResponse,
            loggingIn: null
          })
          window.githubAccessToken = authResponse.github_access_token
          this.historyPush('/grocery_lists')
        }
      })
    }
  }

  handlePopstate = () => [
    this.setState({path: window.location.pathname})
  ]

  profilePic () {
    const { authResponse } = this.state
    return authResponse && authResponse.avatar_url
  }

  handleLogout = () => {
    this.setState({authResponse: null})
    Network.logout().then(() => {
      this.historyPush('/')
    })
  }

  listId = () => {
    const match = /^\/grocery_lists\/([^/]+)\/?.*/.exec(this.state.path)
    return match && match[1]
  }

  showBackArrow = () => ['/', '/grocery_lists'].indexOf(this.state.path) === -1

  render () {
    const { path } = this.state

    return (
      <div className="App">
      {path === '/' && (
        <Homepage loggingIn={this.state.loggingIn}/>
      )}
      {path !== '/' && (
        <Layout
          profilePicUrl={this.profilePic()}
          onLogout={this.handleLogout}
          showBackArrow={this.showBackArrow()}
          >
          {/^\/grocery_lists\/[^/]+\/collaborators/.exec(path) && (
            <ConnectedFriendsList
              listId={this.listId()}
              />
          )}
          {/^\/grocery_lists\/[^/]+\/?$/.exec(path) && (
            <ConnectedGroceryList
              listId={this.listId()}
              user={this.state.authResponse && this.state.authResponse.user_id}
              onAddCollaboratorsClick={() =>
                this.historyPush(`/grocery_lists/${this.listId()}/collaborators`)
              }
              />
          )}
          {path === '/grocery_lists' && (
            <ConnectedGroceryListList
              user={this.state.authResponse && this.state.authResponse.user_id}
              onListClick={id => this.historyPush(`/grocery_lists/${id}`)}
              onShareClick={id => this.historyPush(`/grocery_lists/${id}/collaborators`)}
              />
          )}
        </Layout>
      )}
      </div>
    );
  }
}
