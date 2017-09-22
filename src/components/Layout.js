import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Add from 'material-ui-icons/Add'
import './Layout.css'

export default class Layout extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <Paper className="Layout">
        <AppBar className="Layout__AppBar" position="static">
          <Toolbar className="Layout__Toolbar">
            {window.location.pathname !== '/' ? (
              <IconButton className="Layout__Action" color="contrast">
                <ArrowBack />
              </IconButton>
            ) : (
              <div></div>
            )}
            <Avatar
              className="Layout__Avatar"
              src={this.props.profilePicUrl}
              />
          </Toolbar>
        </AppBar>
        {this.props.children}
      </Paper>
    )
  }
}
