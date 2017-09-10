import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import { TableRow, TableCell } from 'material-ui/Table'
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
      <TableCell>{groceryItem.assigned_to}</TableCell>
    </TableRow>
  )
}

export default Row
