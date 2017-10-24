import React from 'react'
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table'
import Checkbox from 'material-ui/Checkbox'

const Head = props => {
  const { onSelectAllClick,
          onRequestSort,
          columns,
          allChecked,
          sortDirection,
          orderBy } = props

  return (
    <TableHead>
      <TableRow>
        <TableCell checkbox>
          <Checkbox
            checked={allChecked}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {columns.map(column => {
          return (
            <TableCell key={column.key}>
              <TableSortLabel
                active={orderBy === column.key}
                direction={sortDirection}
                onClick={event => onRequestSort(event, column.key)}
              >
                {column.label}
              </TableSortLabel>
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

export default Head
