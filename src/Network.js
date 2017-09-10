export const createList = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      localStorage.setItem('shoppingListId', 'foobar')
      resolve('foobar')
    })
  })
}

export const getGroceries = function (listId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem('groceries') || '[]'))
    })
  })
}

export const addGroceryItem = function (listId, item) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      var groceries = JSON.parse(localStorage.getItem('groceries'))
      item.id = Math.random().toString()
      groceries.push(item)
      localStorage.setItem('groceries', JSON.stringify(groceries))
      resolve(item)
    })
  })
}

export const updateGroceryItem = function (listId, itemId, itemUpdate) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const groceries = JSON.parse(localStorage.getItem('groceries'))
      var item = groceries.find(item => item.id === itemId)
      item = Object.assign(item, itemUpdate)
      localStorage.setItem('groceries', JSON.stringify(groceries))
      resolve(item)
    })
  })
}

export const deleteGroceryItem = function (listId, itemId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const groceries = JSON.parse(localStorage.getItem('groceries'))
      localStorage.setItem(
        'groceries',
        JSON.stringify(groceries.filter(item => item.id !== itemId))
      )
      resolve()
    })
  })
}
