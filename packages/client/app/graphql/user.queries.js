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
      avatar {
        id
        url(size: small)
        alt
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
      avatar {
        id
        url(size: small)
        alt
      }
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
        isInvited
        teams {
          id
          role
          objectId
          global
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

const INVITE_USER = gql`
  mutation InviteUser($email: String!) {
    inviteUser(email: $email) {
      id
    }
  }
`

const GET_USER_BY_INVITATION_TOKEN = gql`
  query UserByInvitationToken($token: String!) {
    userByInvitationToken(token: $token) {
      id
      defaultIdentity {
        email
      }
    }
  }
`

const SIGN_UP_FROM_INVITATION = gql`
  mutation SetupAccountOnInvitation($input: InvitationAccountSetupInput) {
    setupAccountOnInvitation(input: $input) {
      user {
        id
        displayName
        username
        teams {
          id
          role
          objectId
          global
          members {
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
        }
        identities {
          id
          provider
          hasValidRefreshToken
        }
      }
      token
    }
  }
`

const RESEND_INVITATION = gql`
  mutation ResendInvitation($userId: ID!) {
    resendInvitation(userId: $userId)
  }
`

const CANCEL_INVITATION = gql`
  mutation CancelInvitation($userId: ID!) {
    cancelInvitation(userId: $userId)
  }
`

export {
  SEARCH_USERS,
  CURRENT_USER,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PASSWORD,
  FILTER_USERS,
  DEACTIVATE_USER,
  INVITE_USER,
  GET_USER_BY_INVITATION_TOKEN,
  SIGN_UP_FROM_INVITATION,
  RESEND_INVITATION,
  CANCEL_INVITATION,
}
