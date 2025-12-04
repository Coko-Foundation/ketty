import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@coko/client'
import UserDetails from './UserDetails'
import { Button, Center, Modal, Table } from '../common'

const AdminWrapper = styled.div`
  background-color: #e8e8e8;
  min-height: 100vh;
  padding-block: 1rem 3rem;

  h1 {
    text-align: center;
  }
`

const StyledCenter = styled(Center)`
  --max-width: 150ch;
  --s1: 32px;
  background-color: ${th('colorBackground')};
  margin-bottom: 3rem;
  padding-block: calc(var(--s1) / 2) var(--s1);
`

const ModalContext = React.createContext(null)
const { footer: ModalFooter, header: ModalHeader } = Modal

const parseUsers = data => {
  return data?.map(d => ({
    key: d.id,
    displayName: d.displayName,
    email: d.defaultIdentity.email,
    ...d,
  }))
}

const details = {
  expandedRowRender: record => <UserDetails user={record} />,
}

const UserManager = props => {
  const {
    className,
    totalUserCount,
    users,
    currentPage,
    pageSize,
    onPageChange,
    onSearch,
    onDeactivate,
    currentUser,
  } = props

  const [modal, contextHolder] = Modal.useModal()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      showSorterTooltip: true,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, user) => {
        return (
          <Button
            disabled={user.id === currentUser.id}
            onClick={
              user.id !== currentUser.id ? () => handleDeactivate(user) : null
            }
            status="danger"
            type="primary"
          >
            Deactivate
          </Button>
        )
      },
    },
  ]

  const pagination = {
    current: currentPage,
    pageSize,
    total: totalUserCount,
    onChange: onPageChange,
  }

  const handleDeactivate = user => {
    const warningModal = modal.warning()
    warningModal.update({
      title: <ModalHeader>Deactivate user</ModalHeader>,
      content: (
        <p>
          Are you sure you want to deactivate user {user.displayName}? This will
          block them from signing in with their email, but will not delete the
          books they created.
        </p>
      ),
      footer: [
        <ModalFooter key="footer">
          <Button key="cancel" onClick={() => warningModal.destroy()}>
            Cancel
          </Button>
          <Button
            autoFocus
            key="deactivate"
            onClick={() =>
              onDeactivate(user.id).then(() => {
                warningModal.destroy()
              })
            }
            status="danger"
            type="primary"
          >
            Deactivate
          </Button>
        </ModalFooter>,
      ],
    })
  }

  return (
    <ModalContext.Provider value={null}>
      <AdminWrapper className={className}>
        <StyledCenter>
          <h1>Manage Users</h1>
          <Table
            columns={columns}
            dataSource={parseUsers(users)}
            expandable={details}
            // loading={loading}
            onSearch={onSearch}
            pagination={pagination}
            searchPlaceholder="Search for users by name or email"
            showSearch
          />
        </StyledCenter>
      </AdminWrapper>
      {contextHolder}
    </ModalContext.Provider>
  )
}

UserManager.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()),
  totalUserCount: PropTypes.number,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func,
  onDeactivate: PropTypes.func,
  currentUser: PropTypes.shape(),
}

UserManager.defaultProps = {
  users: [],
  totalUserCount: 0,
  currentPage: 1,
  pageSize: 10,
  onPageChange: null,
  onSearch: null,
  onDeactivate: null,
  currentUser: null,
}

export default UserManager
