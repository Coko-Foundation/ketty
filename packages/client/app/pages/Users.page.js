import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { useCurrentUser } from '@coko/client'
import { isAdmin } from '../helpers/permissions'
import { UserManager } from '../ui/admin'
import { FILTER_USERS, DEACTIVATE_USER } from '../graphql'

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

  if (currentUser && !isAdmin(currentUser)) {
    history.push('/dashboard')
  }

  return (
    <UserManager
      currentPage={currentPage + 1}
      currentUser={currentUser}
      onDeactivate={handleDeactivate}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
      pageSize={PAGE_SIZE}
      totalUserCount={data?.filterUsers?.totalCount}
      users={data?.filterUsers?.result}
    />
  )
}

export default UsersPage
