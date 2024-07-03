import { gql } from '@apollo/client'

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($file: Upload!, $maxLng: Int, $bookId: String!) {
    createDocument(file: $file, maxLng: $maxLng, bookId: $bookId) {
      id
      name
      extension
      sectionsKeys
      bookId
    }
  }
`

export const DELETE_DOCUMENT = gql`
  mutation DeleteFolder($id: ID!) {
    deleteFolder(id: $id)
  }
`

export const GET_DOCUMENTS = gql`
  query GetAllDocuments($bookId: String!) {
    getDocuments(bookId: $bookId) {
      id
      name
      extension
      sectionsKeys
      bookId
    }
  }
`
