/* eslint-disable no-restricted-syntax */
export const findFirstDocument = data => {
  for (let node of data) {
    if (!node.isFolder && node.bookComponentId) {
      return node
    }
    if (node.children) {
      for (let child of node.children) {
        return findFirstDocument([child])
      }
    }
  }

  return null
}

export const findParentNode = (data, childKey) => {
  for (let node of data) {
    if (node.children) {
      for (let child of node.children) {
        if (child.key === childKey) {
          return node
        }
      }
      const found = findParentNode(node.children, childKey)
      if (found) {
        return found
      }
    }
  }
  return null
}

export const findChildNodeByBookComponentId = (data, bookComponentId) => {
  for (let node of data) {
    if (node.children) {
      for (let child of node.children) {
        if (child.bookComponentId === bookComponentId) {
          return child
        }
      }

      const found = findChildNodeByBookComponentId(
        node.children,
        bookComponentId,
      )

      if (found) {
        return found
      }
    }
  }

  return null
}
