import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '@coko/client'
import { isAdmin } from '../helpers/permissions'
import { UserManager } from '../ui/admin'
import {
  FILTER_USERS,
  DEACTIVATE_USER,
  INVITE_USER,
  RESEND_INVITATION,
  CANCEL_INVITATION,
  MAKE_ADMIN,
} from '../graphql'

const PAGE_SIZE = 10

const UsersPage = () => {
  const { currentUser } = useCurrentUser()
  const history = useHistory()

  const [currentPage, setCurrentPage] = useState(0)
  const [searchParams, setSearchParams] = useState('')

  const { data } = useQuery(FILTER_USERS, {
    variables: {
      filter: {
        isActive: true,
        ...searchParams,
      },
      pageInput: {
        page: currentPage,
        pageSize: PAGE_SIZE,
      },
    },
  })

  const [deactivateUserMutation] = useMutation(DEACTIVATE_USER, {
    refetchQueries: [
      {
        query: FILTER_USERS,
        variables: {
          filter: {
            isActive: true,
            ...searchParams,
          },
          pageInput: {
            page: currentPage,
            pageSize: PAGE_SIZE,
          },
        },
        fetchPolicy: 'network-only',
      },
    ],
  })

  const [inviteUserMutation] = useMutation(INVITE_USER, {
    refetchQueries: [
      {
        query: FILTER_USERS,
        variables: {
          filter: {
            isActive: true,
            ...searchParams,
          },
          pageInput: {
            page: currentPage,
            pageSize: PAGE_SIZE,
          },
        },
        fetchPolicy: 'network-only',
      },
    ],
  })

  const [resendInvitationMutation] = useMutation(RESEND_INVITATION)

  const [cancelInvitationMutation] = useMutation(CANCEL_INVITATION, {
    refetchQueries: [
      {
        query: FILTER_USERS,
        variables: {
          filter: {
            isActive: true,
            ...searchParams,
          },
          pageInput: {
            page: currentPage,
            pageSize: PAGE_SIZE,
          },
        },
        fetchPolicy: 'network-only',
      },
    ],
  })

  const [makeAdminMutation] = useMutation(MAKE_ADMIN, {
    refetchQueries: [
      {
        query: FILTER_USERS,
        variables: {
          filter: {
            isActive: true,
            ...searchParams,
          },
          pageInput: {
            page: currentPage,
            pageSize: PAGE_SIZE,
          },
        },
        fetchPolicy: 'network-only',
      },
    ],
  })

  const handlePageChange = page => {
    setCurrentPage(page - 1)
  }

  const handleSearch = search => {
    setCurrentPage(0)
    setSearchParams({ search })
  }

  const handleDeactivate = id => {
    const variables = {
      ids: [id],
    }

    return deactivateUserMutation({ variables })
  }

  const handleMakeAdmin = userId => {
    const variables = {
      userId,
    }

    return makeAdminMutation({ variables })
  }

  const handleInviteUser = email => {
    const variables = {
      email,
    }

    return inviteUserMutation({ variables })
  }

  const handleResendInvitation = userId => {
    const variables = {
      userId,
    }

    return resendInvitationMutation({ variables })
  }

  const handleCancelInvitation = userId => {
    const variables = {
      userId,
    }

    return cancelInvitationMutation({ variables })
  }

  if (currentUser && !isAdmin(currentUser)) {
    history.push('/dashboard')
  }

  return (
    <UserManager
      currentPage={currentPage + 1}
      currentUser={currentUser}
      onCancelInvitation={handleCancelInvitation}
      onDeactivate={handleDeactivate}
      onInviteUser={handleInviteUser}
      onMakeAdmin={handleMakeAdmin}
      onPageChange={handlePageChange}
      onResendInvitation={handleResendInvitation}
      onSearch={handleSearch}
      pageSize={PAGE_SIZE}
      totalUserCount={data?.filterUsers?.totalCount}
      users={data?.filterUsers?.result}
    />
  )
}

export default UsersPage
