import React from 'react'
import { findDOMNode } from 'react-dom'
import { TableRow, TableCell } from 'material-ui/Table'
import Popover from 'material-ui/Popover'
import TextField from 'material-ui/TextField'
import './ItemAdderRow.css'


class ItemAdderRow extends React.Component {
  constructor() {
    super()
    this.state = {
      itemDescription: ''
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleEnterKey)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleEnterKey)
  }

  handleEnterKey = (evt) => {
    if (this.state.dialogOpen && evt.keyCode === 13) {
      this.props.onAddItem(this.state.itemDescription)
      this.setState({
        dialogOpen: false,
        itemDescription: ''
      })
    }
  }

  handleAddItemClick = () => {
    this.setState({
      dialogOpen: true,
      anchorEl: findDOMNode(this.anchor)
    })
  }

  render() {
    const { dialogOpen, anchorEl, itemDescription } = this.state

    return (
      <TableRow className="ItemAdderRow">
        <TableCell></TableCell>
        <TableCell
          ref={node => { this.anchor = node }}
          onClick={this.handleAddItemClick}
          >
          Add item...
        </TableCell>
        <Popover
          open={dialogOpen}
          anchorEl={anchorEl}
          onRequestClose={() => this.setState({dialogOpen: false})}
          anchorOrigin={{vertical: 'center', horizontal: 'center'}}
          transformOrigin={{vertical: 'center', horizontal: 'center'}}
          >
          <TextField
            autoFocus
            id="name"
            label="Item Description"
            placeholder="deadbeef"
            value={itemDescription}
            onChange={event => this.setState({itemDescription: event.target.value})}
            />
        </Popover>
        <TableCell></TableCell>
      </TableRow>
    )
  }
}

export default ItemAdderRow
