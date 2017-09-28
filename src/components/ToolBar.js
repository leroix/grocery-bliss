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
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import AssignDialog from './AssignDialog'

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

  handleAssignTo = id => {
    this.closeActionMenu()
    this.props.onAssignTo(id)
  }

  render() {
    const {
      numSelected,
      classes,
      title,
      onToggleObtained,
      onRemoveItems,
      collaborators
    } = this.props
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
            <Typography type="title">{title}</Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 && (
            <div className="ActionMenu">
              <Button
                aria-label="Actions"
                ref={node => { this.button = node }}
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
                {this.state.assignDialogOpen
                  ? (
                    <AssignDialog
                      collaborators={collaborators}
                      onAssignTo={this.handleAssignTo}
                      onAddCollaboratorsClick={this.props.onAddCollaboratorsClick}
                      />
                  )
                  : (
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
                      <ListItem
                        button
                        onClick={() => this.setState({assignDialogOpen: true})}
                        >
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText primary="Assign To" />
                        <ListItemIcon>
                          <KeyboardArrowRight />
                        </ListItemIcon>
                      </ListItem>
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
                  )}
              </Popover>
            </div>
          )}
        </div>
      </Toolbar>
    )
  }
}

export default withStyles(toolbarStyles)(ToolBar)
