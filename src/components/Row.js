import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import { TableRow, TableCell } from 'material-ui/Table'
import Avatar from 'material-ui/Avatar'
import './Row.css'

const Row = props => {
  const { groceryItem, onSelectItem, checked } = props

  return (
    <TableRow
      key={groceryItem.id}
      className={'GroceryListRow ' + (groceryItem.obtained ? 'GroceryListRow--obtained' : '')}>
      <TableCell checkbox>
        <Checkbox
          checked={checked}
          onChange={onSelectItem}
          />
      </TableCell>
      <TableCell>{groceryItem.name}</TableCell>
      <TableCell>
        <Avatar
          src={groceryItem.assigned_to && `https://graph.facebook.com/${groceryItem.assigned_to}/picture?type=square`}
          />
      </TableCell>
    </TableRow>
  )
}

export default Row
