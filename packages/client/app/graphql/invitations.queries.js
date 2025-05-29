import { gql } from '@apollo/client'

const SEND_INVITATIONS = gql`
  mutation SendInvitations(
    $teamId: ID!
    $bookId: ID!
    $members: [String]!
    $status: String!
  ) {
    sendInvitations(
      teamId: $teamId
      bookId: $bookId
      members: $members
      status: $status
    ) {
      role
      members {
        status
        user {
          displayName
          email
        }
      }
    }
  }
`

const HANDLE_INVITATION = gql`
  mutation HandleInvitation($token: String!) {
    handleInvitation(token: $token)
  }
`

const GET_INVITATIONS = gql`
  query GetInvitations($bookId: ID!) {
    getInvitations(bookId: $bookId) {
      role
      members {
        status
        user {
          displayName
          email
        }
      }
    }
  }
`

const DELETE_INVITATION = gql`
  mutation DeleteInvitation($bookId: ID!, $email: String!) {
    deleteInvitation(bookId: $bookId, email: $email) {
      role
      members {
        status
        user {
          displayName
          email
        }
      }
    }
  }
`

const UPDATE_INVITATION = gql`
  mutation UpdateInvitation($bookId: ID!, $email: String!, $status: String!) {
    updateInvitation(bookId: $bookId, status: $status, email: $email) {
      role
      members {
        status
        user {
          displayName
          email
        }
      }
    }
  }
`

export {
  SEND_INVITATIONS,
  HANDLE_INVITATION,
  GET_INVITATIONS,
  DELETE_INVITATION,
  UPDATE_INVITATION,
}
