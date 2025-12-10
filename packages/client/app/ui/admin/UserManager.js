import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@coko/client'
import { useTranslation, Trans } from 'react-i18next'
import UserDetails from './UserDetails'
import { Button, Center, Modal, Table, Text } from '../common'

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
  const { t } = useTranslation(null, { keyPrefix: 'pages.manageUsers' })

  const columns = [
    {
      title: t('table.columns.name'),
      dataIndex: 'displayName',
      key: 'displayName',
    },
    { title: t('table.columns.email'), dataIndex: 'email', key: 'email' },
    {
      title: t('table.columns.actions'),
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
            {t('table.actions.deactivate')}
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
      title: <ModalHeader>{t('modals.deactivate.title')}</ModalHeader>,
      content: (
        <p>
          <Trans
            components={[<Text strong />]}
            i18nKey="pages.manageUsers.modals.deactivate.warning"
            values={{ userName: user.displayName }}
          />
        </p>
      ),
      footer: [
        <ModalFooter key="footer">
          <Button key="cancel" onClick={() => warningModal.destroy()}>
            {t('modals.deactivate.cancel')}
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
            {t('modals.deactivate.confirm')}
          </Button>
        </ModalFooter>,
      ],
    })
  }

  return (
    <ModalContext.Provider value={null}>
      <AdminWrapper className={className}>
        <StyledCenter>
          <h1>{t('title')}</h1>
          <Table
            columns={columns}
            dataSource={parseUsers(users)}
            expandable={details}
            // loading={loading}
            onSearch={onSearch}
            pagination={pagination}
            searchPlaceholder={t('table.search')}
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
