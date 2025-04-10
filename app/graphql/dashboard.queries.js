import { gql } from '@apollo/client'

export const GET_TREE_MANAGER_AND_SHARED_DOCS = gql`
  query getDocTree($folderId: ID) {
    getDocTree(folderId: $folderId)
    getSharedDocTree {
      id
      key
      title
      isFolder
      bookComponent {
        id
      }
      children {
        id
        key
        title
        isFolder
        bookComponent {
          id
        }
      }
    }
  }
`

export const ADD_RESOURCE = gql`
  mutation addResource(
    $id: ID
    $bookId: ID
    $divisionId: ID
    $isFolder: Boolean!
  ) {
    addResource(
      id: $id
      bookId: $bookId
      divisionId: $divisionId
      isFolder: $isFolder
    ) {
      id
      title
    }
  }
`

export const RENAME_RESOURCE = gql`
  mutation renameResource($id: ID!, $title: String!) {
    renameResource(id: $id, title: $title) {
      id
      title
    }
  }
`

export const DELETE_RESOURCE = gql`
  mutation deleteResource($id: ID!) {
    deleteResource(id: $id) {
      id
      title
    }
  }
`

export const REORDER_RESOURCE = gql`
  mutation updateTreePosition($id: ID!, $newParentId: ID, $newPosition: Int!) {
    updateTreePosition(
      id: $id
      newParentId: $newParentId
      newPosition: $newPosition
    ) {
      id
      title
    }
  }
`
