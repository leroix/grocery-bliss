// TODO: REMOVE ME - only used for stand-in local storage-based network implementation
// Don't use me in your implementation.
const _getGroceryLists = () => JSON.parse(localStorage.getItem('groceryLists') || '[]')
const saveGroceryLists = lists => localStorage.setItem('groceryLists', JSON.stringify(lists))
let user
//////

const BASE_URL = '/api/v1'

const parseBody = response => {
  if (!response.ok) {
    return null
  }
  return response.json()
}

export const login = function (code) {
  if (!code) {
    return Promise.resolve(null)
  }

  return fetch(`${BASE_URL}/login`, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: code,
      state: window.localStorage.getItem('githubOauthState')
    })
  })
  .then(parseBody)
  .then(body => {
    if (body) {
      user = body.user_id
    }

    return body
  })
}

export const logout = function () {
  return fetch(`${BASE_URL}/logout`, {
    method: 'POST'
  })
}

export const getGroceryLists = function () {
  const lists = _getGroceryLists()
  const myLists = lists.filter(list => {
    return list.owner === user || list.collaborators.indexOf(user) > -1
  })

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(myLists)
    })
  })
}

export const getGroceryList = function (listId) {
  const lists = _getGroceryLists()
  const list = lists.find(l => l.id === listId)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(list)
    })
  })
}

export const addGroceryList = function (list) {
  const _list = Object.assign(
    {groceries: [], collaborators: []},
    list,
    list.id ? {} : {id: Math.random().toString()}
  )
  const lists = _getGroceryLists()
  const alreadyExists = lists.find(l => l.id === list.id)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (alreadyExists) {
        reject('list with id already exists')
      } else {
        lists.push(_list)
        saveGroceryLists(lists)
        resolve(_list)
      }
    })
  })
}

export const deleteGroceryList = function (listId) {
  const lists = _getGroceryLists()
  const updatedLists = lists.filter(l => l.id !== listId)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      saveGroceryLists(updatedLists)
      resolve(null)
    })
  })
}

export const addGroceryItem = function (listId, item) {
  const lists = _getGroceryLists()
  const list = lists.find(l => l.id === listId)
  const alreadyExists = list.groceries.find(it => it.id === item.id)
  const _item = Object.assign(
    {},
    item,
    item.id ? {} : {id: Math.random().toString()}
  )

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (alreadyExists) {
        reject('item with this id already exists')
      } else {
        list.groceries.push(_item)
        saveGroceryLists(lists)
        resolve(_item)
      }
    })
  })
}

export const updateGroceryItems = function (listId, items) {
  const lists = _getGroceryLists()
  const list = lists.find(l => l.id === listId)

  items.forEach(updatedItem => {
    let savedItem = list.groceries.find(k => k.id === updatedItem.id)
    Object.assign(savedItem, updatedItem)
  })

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      saveGroceryLists(lists)
      resolve(list.groceries)
    })
  })
}

export const deleteGroceryItems = function (listId, itemIds) {
  const lists = _getGroceryLists()
  const list = lists.find(l => l.id === listId)
  list.groceries = list.groceries.filter(l => itemIds.indexOf(l.id) === -1)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      saveGroceryLists(lists)
      resolve(null)
    })
  })
}

export const addCollaborator = function (listId, userFbId) {
  const lists = _getGroceryLists()
  const list = lists.find(l => l.id === listId)

  if (list.collaborators.indexOf(userFbId) === -1) {
    list.collaborators = list.collaborators.concat(userFbId)
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      saveGroceryLists(lists)
      resolve(list.collaborators)
    })
  })
}

export const removeCollaborator = function (listId, userFbId) {
  const lists = _getGroceryLists()
  const list = lists.find(l => l.id === listId)
  list.collaborators = list.collaborators.filter(c => c !== userFbId)

  return new Promise((resolve, reject) => {
    saveGroceryLists(lists)
    resolve(list.collaborators)
  })
}