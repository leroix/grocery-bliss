import React from 'react'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
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
import LocalGroceryStore from 'material-ui-icons/LocalGroceryStore'
import Share from 'material-ui-icons/Share'
import Delete from 'material-ui-icons/Delete'
import './GroceryListList.css'

const Item = props => {
  const { title, ownerImageUrl, created, onShare, onDelete } = props
  const date = new Date(created)

  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar
          src={ownerImageUrl}
          />
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={date.toLocaleDateString()}
      />
      <ListItemSecondaryAction>
        {onShare && (
          <IconButton aria-label="Share" onClick={onShare}>
            <Share />
          </IconButton>
        )}
        {onDelete && (
          <IconButton aria-label="Delete" onClick={onDelete}>
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
    groceryLists: [
      {
        id: '123',
        title: 'Office Party',
        created: 1506096988571,
        ownerImageUrl: 'https://d4n5pyzr6ibrc.cloudfront.net/media/27FB7F0C-9885-42A6-9E0C19C35242B5AC/4785B1C2-8734-405D-96DC23A6A32F256B/thul-90efb785-97af-5e51-94cf-503fc81b6940.jpg?response-content-disposition=inline',
        allowShare: true,
        allowDelete: true
      }
    ]
  }

  onShare = id => () => this.props.onShare(id)

  onDelete = id => () => {
    this.setState({
      snackbarOpen: true,
      lastDeletedId: id
    })
    this.props.onDelete(id)
  }

  onUndoDelete = () => {
    this.onSnackbarClose()
    this.props.onUndoDelete(this.state.lastDeletedId)
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

  render () {
    return (
      <div className="GroceryListList">
        <List dense={false}>
          {this.props.groceryLists.map(list => (
            <Item
              key={list.id}
              title={list.title}
              created={list.created}
              ownerImageUrl={list.ownerImageUrl}
              onShare={list.allowShare && this.onShare(list.id)}
              onDelete={list.allowDelete && this.onDelete(list.id)}
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
            <Button key="undo" color="accent" dense onClick={this.onUndoDelete}>
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
