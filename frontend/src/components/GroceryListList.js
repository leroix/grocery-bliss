import React from 'react'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar'
import TextField from 'material-ui/TextField'
import CloseIcon from 'material-ui-icons/Close'
import Share from 'material-ui-icons/Share'
import Delete from 'material-ui-icons/Delete'
import './GroceryListList.css'

import UserAvatar from './UserAvatar'

const Item = props => {
  const { title, owner, created, onShareClick, onDeleteClick, onClick } = props
  const date = new Date(created)

  return (
    <ListItem button onClick={onClick}>
      <ListItemAvatar>
        <UserAvatar id={owner} />
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={date.toLocaleDateString()}
      />
      <ListItemSecondaryAction>
        {onShareClick && (
          <IconButton aria-label="Share" onClick={onShareClick}>
            <Share />
          </IconButton>
        )}
        {onDeleteClick  && (
          <IconButton aria-label="Delete" onClick={onDeleteClick }>
            <Delete />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default class GroceryListList extends React.Component {
  constructor () {
    super()
    this.state = {
      snackbarOpen: false,
      newListName: '',
      addBoxOpen: false
    }
  }

  static defaultProps = {
    groceryLists: []
  }

  onShareClick = id => () => this.props.onShareClick(id)

  onDeleteClick = id => () => {
    this.setState({
      snackbarOpen: true,
      lastDeletedId: id
    })
    this.props.onDeleteClick (id)
  }

  onUndoDeleteClick = () => {
    this.onSnackbarClose()
    this.props.onUndoDeleteClick(this.state.lastDeletedId)
  }

  onSnackbarClose = (evt, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({snackbarOpen: false})
  }

  showAddBox = () => this.setState({addBoxOpen: true})

  listenForEnterKey = evt => {
    if (evt.keyCode === 13) {
      this.props.onAddList(this.state.newListName)
      this.setState({
        addBoxOpen: false,
        newListName: ''
      })
    }
  }

  ownsList = owner => {
    return this.props.user === owner
  }

  render () {
    return (
      <div className="GroceryListList">
        <List dense={false}>
          {this.props.groceryLists.slice().sort((a, b) => b.created - a.created).map(list => (
            <Item
              key={list.id}
              title={list.name}
              created={list.created}
              owner={list.owner}
              onShareClick={this.ownsList(list.owner) && this.onShareClick(list.id)}
              onDeleteClick ={this.ownsList(list.owner) && this.onDeleteClick(list.id)}
              onClick={() => this.props.onListClick(list.id)}
              />
          ))}
          {this.state.addBoxOpen && (
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  />
              </ListItemAvatar>
              <ListItemText
                primary={(
                  <TextField
                    autoFocus={true}
                    onBlur={() => this.setState({addBoxOpen: false, newListName: ''})}
                    id="name"
                    label="New List Name"
                    value={this.state.newListName}
                    onChange={evt => this.setState({newListName: evt.target.value})}
                    onKeyUp={this.listenForEnterKey}
                    margin="normal"
                    />
                )}
                />
            </ListItem>
          )}
        </List>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbarOpen}
          onRequestClose={this.onSnackbarClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Grocery list deleted</span>}
          action={[
            <Button key="undo" color="accent" dense onClick={this.onUndoDeleteClick}>
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.onSnackbarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <div className="GroceryListList__AddContainer">
          <Button
            className="GroceryListList__Add"
            fab
            color="accent"
            aria-label="add"
            onClick={this.showAddBox}
            >
            <AddIcon />
          </Button>
        </div>
      </div>
    )
  }
}
