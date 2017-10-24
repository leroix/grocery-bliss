import React from 'react'
import { findDOMNode } from 'react-dom'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import ArrowBack from 'material-ui-icons/ArrowBack'
import './Layout.css'

export default class Layout extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    const { onLogout } = this.props
    return (
      <Paper className="Layout">
        <AppBar className="Layout__AppBar" position="static">
          <Toolbar className="Layout__Toolbar">
            {this.props.showBackArrow ? (
              <IconButton
                className="Layout__Action"
                color="contrast"
                onClick={() => window.history.back()}
                >
                <ArrowBack />
              </IconButton>
            ) : (
              <div></div>
            )}
            <Avatar
              ref={node => { this.avatar = findDOMNode(node) }}
              className="Layout__Avatar"
              src={this.props.profilePicUrl}
              onClick={() => this.setState({showMenu: true})}
              />
            <Menu
              anchorEl={this.avatar}
              open={this.state.showMenu}
              onRequestClose={() => this.setState({showMenu: false})}
              >
              <MenuItem onClick={(...args) => {
                this.setState({showMenu: false})
                onLogout(...args)
              }}>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        {this.props.children}
      </Paper>
    )
  }
}
