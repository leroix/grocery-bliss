import React, { Component } from 'react'
import Table, { TableBody } from 'material-ui/Table'
import './GroceryList.css'
import ToolBar from './ToolBar'
import Head from './Head'
import Row from './Row'
import ItemAdderRow from './ItemAdderRow'

class GroceryList extends Component {
  static defaultProps = {
    groceryItems: []
  }

  constructor() {
    super()
    this.state = {selectedItems: []}
  }

  componentWillReceiveProps() {
    const { selectedItems } = this.state
    const { groceryItems } = this.props
    const ids = groceryItems.map(item => item.id)
    this.setState({
      selectedItems: selectedItems.filter(id => ids.indexOf(id) > -1)
    })
  }

  handleSortRequest = (event, columnKey) => {
    this.setState({
      orderBy: columnKey,
      sortDirection: this.state.sortDirection === 'desc' ? 'asc' : 'desc'
    })
  }

  allChecked = () => {
    const { groceryItems = [] } = this.props
    return this.state.selectedItems.length === groceryItems.length
      && groceryItems.length !== 0
  }

  handleSelectAllClick = event => {
    this.setState({
      selectedItems: this.allChecked()
        ? []
        : this.props.groceryItems.map(item => item.id)
    })
  }

  handleItemSelectChange = itemId => (event, checked) => {
    const itemFreeList = this.state.selectedItems.filter(id => id !== itemId)

    this.setState({
      selectedItems: checked ? itemFreeList.concat(itemId) : itemFreeList
    })
  }

  sortedGroceryItems = () => {
    var groceryItems = this.props.groceryItems.slice()
    const { orderBy, sortDirection } = this.state
    const localeCompare = (a,b) => (a[orderBy] || '').localeCompare(b[orderBy] || '')
    const compare = {
      asc: (a,b) => localeCompare(a,b),
      desc: (a,b) => localeCompare(b,a)
    }
    return groceryItems.sort(compare[sortDirection])
  }

  handleAssignTo = name => {
    this.props.onAssignTo(name, this.state.selectedItems)
  }

  render() {
    const { selectedItems } = this.state
    const columns = [
      {key: 'name', label: 'Item'},
      {key: 'assigned_to', label: 'Assigned To'}
    ]

    return (
      <div className="GroceryList">
        <ToolBar
          numSelected={this.state.selectedItems.length}
          title={this.props.listName}
          onAssignTo={this.handleAssignTo}
          onToggleObtained={() => this.props.onToggleObtained(selectedItems)}
          onRemoveItems={() => this.props.onRemoveItems(selectedItems)}
          onAddCollaboratorsClick={this.props.onAddCollaboratorsClick}
          collaborators={this.props.collaborators}
          />
        <Table>
          <Head
            onSelectAllClick={this.handleSelectAllClick}
            onRequestSort={this.handleSortRequest}
            columns={columns}
            sortDirection={this.state.sortDirection}
            orderBy={this.state.orderBy}
            allChecked={this.allChecked()}
            />

          <TableBody>
            {this.sortedGroceryItems().map(item => {
              return (
                <Row
                  key={item.id}
                  checked={this.state.selectedItems.indexOf(item.id) > -1}
                  groceryItem={item}
                  onSelectItem={this.handleItemSelectChange(item.id)}
                  />
              )
            })}
            <ItemAdderRow onAddItem={this.props.onAddItem}/>
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default GroceryList
