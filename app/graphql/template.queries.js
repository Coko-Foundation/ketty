import { gql } from '@apollo/client'

const GET_TEMPLATES = gql`
  query GetTemplates($ascending: Boolean = true, $sortKey: String = "name") {
    getTemplates(ascending: $ascending, sortKey: $sortKey) {
      id
      name
      thumbnail {
        name
        mimetype
        id
        source
      }
      author
      trimSize
      target
      notes
    }
  }
`

const GET_SPECIFIC_TEMPLATES = gql`
  query GetSpecificTemplates($where: TemplatesWhereInput!) {
    getSpecificTemplates(where: $where) {
      id
      default
      name
      thumbnail {
        id
        name
        url(size: small)
        storedObjects {
          mimetype
        }
      }
      trimSize
      target
      notes
    }
  }
`

const TEMPLATE_UPDATED_SUBSCRIPTION = gql`
  subscription TemplatedUpdated($id: ID!) {
    templateUpdated(id: $id)
  }
`

// const GET_BOOK_ASSOCIATED_TEMPLATES = gql`
//   query GetBook($id: ID!) {
//     getBook(id: $id) {
//       associatedTemplates {
//         pagedjs {
//           trimSize
//           templateId
//           additionalExportOptions {
//             includeTOC
//             includeCopyrights
//             includeTitlePage
//           }
//         }
//         epub {
//           templateId
//           additionalExportOptions {
//             includeTOC
//             includeCopyrights
//             includeTitlePage
//           }
//         }
//       }
//     }
//   }
// `

const UPDATE_ASSOCIATED_TEMPLATES = gql`
  mutation UpdateAssociatedTemplates(
    $bookId: ID!
    $associatedTemplates: AssociatedTemplatesInput!
  ) {
    updateAssociatedTemplates(
      bookId: $bookId
      associatedTemplates: $associatedTemplates
    ) {
      id
      associatedTemplates {
        pagedjs {
          templateId
          trimSize
          additionalExportOptions {
            includeTOC
            includeCopyrights
            includeTitlePage
          }
        }
        epub {
          templateId
          additionalExportOptions {
            includeTOC
            includeCopyrights
            includeTitlePage
          }
        }
      }
    }
  }
`

export {
  GET_TEMPLATES,
  GET_SPECIFIC_TEMPLATES,
  TEMPLATE_UPDATED_SUBSCRIPTION,
  UPDATE_ASSOCIATED_TEMPLATES,
}
