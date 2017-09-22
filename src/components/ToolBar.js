import React from 'react'
import { findDOMNode } from 'react-dom'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Popover from 'material-ui/Popover'
import Button from 'material-ui/Button'
import ArrowDropDown from 'material-ui-icons/ArrowDropDown'
import Check from 'material-ui-icons/Check'
import Delete from 'material-ui-icons/Delete'
import Person from 'material-ui-icons/Person'
import TextField from 'material-ui/TextField'

class AssignDialog extends React.Component {
  constructor() {
    super()
    this.state = {name: ''}
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleEnterKey)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleEnterKey)
  }

  handleEnterKey = (evt) => {
    if (evt.keyCode === 13) {
      this.props.onAssignTo(this.state.name)
    }
  }

  render() {
    const { name } = this.state
    return (
      <TextField
        autoFocus
        id="name"
        label="Person To Assign"
        placeholder="Joe"
        value={name}
        onChange={event => this.setState({name: event.target.value})}
        />
    )
  }
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: 2,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.A700,
          backgroundColor: theme.palette.secondary.A100,
        }
      : {
          color: theme.palette.secondary.A100,
          backgroundColor: theme.palette.secondary.A700,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class ToolBar extends React.Component {
  constructor() {
    super()
    this.state = {
      actionMenuOpen: false
    }
  }

  handleActionMenuClick = () => {
    this.setState({
      actionMenuOpen: true,
      actionMenuAnchorEl: findDOMNode(this.button)
    })
  }

  closeActionMenu = () => {
    this.setState({
      actionMenuOpen: false,
      assignDialogOpen: false
    })
  }

  handleAssignTo = name => {
    this.closeActionMenu()
    this.props.onAssignTo(name)
  }

  render() {
    const { numSelected, classes, onToggleObtained, onRemoveItems } = this.props
    const { actionMenuOpen, actionMenuAnchorEl } = this.state

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
        >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography type="subheading">{numSelected} selected</Typography>
          ) : (
            <Typography type="title">Office Party</Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 && (
            <div className="ActionMenu">
              <Button
                aria-label="Actions"
                ref={node => { this.button = node}}
                onClick={this.handleActionMenuClick}
                >
                Actions <ArrowDropDown />
              </Button>
              <Popover
                open={actionMenuOpen}
                anchorEl={actionMenuAnchorEl}
                onRequestClose={() => this.closeActionMenu()}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                >
                <List>
                  <ListItem
                    button
                    onClick={() => { this.closeActionMenu(); onToggleObtained() }}
                    >
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    <ListItemText primary="Toggle Obtained" />
                  </ListItem>
                  {this.state.assignDialogOpen
                    ? (
                      <ListItem>
                        <AssignDialog
                          onAssignTo={this.handleAssignTo}
                          />
                      </ListItem>
                    )
                    : (
                      <ListItem
                        button
                        onClick={() => this.setState({assignDialogOpen: true})}
                        >
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText primary="Assign To" />
                      </ListItem>
                    )}
                  <ListItem
                    button
                    onClick={() => { this.closeActionMenu(); onRemoveItems() }}
                    >
                    <ListItemIcon>
                      <Delete />
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                  </ListItem>
                </List>
              </Popover>
            </div>
          )}
        </div>
      </Toolbar>
    )
  }
}

export default withStyles(toolbarStyles)(ToolBar)
