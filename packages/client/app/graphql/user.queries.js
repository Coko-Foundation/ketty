import { gql } from '@apollo/client'

const SEARCH_USERS = gql`
  mutation SearchForUsers(
    $search: String!
    $exclude: [ID]!
    $exactMatch: Boolean
  ) {
    searchForUsers(
      search: $search
      exclude: $exclude
      exactMatch: $exactMatch
    ) {
      id
      displayName
      surname
    }
  }
`

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      displayName
      givenNames
      surname
      username
      teams {
        id
        role
        objectId
        global
        members(currentUserOnly: true) {
          id
          user {
            id
          }
          status
        }
      }
      isActive
      defaultIdentity {
        id
        isVerified
        email
      }
      identities {
        id
        provider
        hasValidRefreshToken
      }
    }
  }
`

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      displayName
      givenNames
      surname
      defaultIdentity {
        id
        email
      }
    }
  }
`

const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input)
  }
`

const FILTER_USERS = gql`
  query FilterUsers($filter: UserFilter, $pagination: PageInput) {
    filterUsers(filter: $filter, pagination: $pagination) {
      result {
        id
        created
        displayName
        defaultIdentity {
          email
        }
        books {
          id
          title
          authors {
            id
          }
        }
      }
      totalCount
    }
  }
`

const DEACTIVATE_USER = gql`
  mutation DeactivateUser($ids: [ID!]!) {
    deactivateUsers(ids: $ids) {
      id
    }
  }
`

export {
  SEARCH_USERS,
  CURRENT_USER,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PASSWORD,
  FILTER_USERS,
  DEACTIVATE_USER,
}
