import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  UserAddOutlined,
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { th } from '@coko/client'
import { useTranslation, Trans } from 'react-i18next'
import UserDetails from './UserDetails'
import {
  Button,
  ButtonGroup,
  Center,
  Form,
  Input,
  Modal,
  Table,
  Text,
} from '../common'
import AdminWrapper from './AdminWrapper'

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
    onInviteUser,
    onResendInvitation,
    onCancelInvitation,
  } = props

  const [modal, contextHolder] = Modal.useModal()
  const [inviteUserForm] = Form.useForm()

  const [resendInvitation, setResendingInvitation] = useState({
    text: 'Resend invitation',
  })

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
        return user.isInvited ? (
          <ButtonGroup>
            <Button
              onClick={() =>
                !resendInvitation.disabled && handleResendInvitation(user.id)
              }
              // status="success"
              type="primary"
            >
              {resendInvitation.text}
            </Button>
            <Button
              onClick={() => onCancelInvitation(user.id)}
              status="danger"
              type="primary"
            >
              Cancel invitation
            </Button>
          </ButtonGroup>
        ) : (
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

  const handleAddNewUser = () => {
    const newUserModal = modal.success()
    newUserModal.update({
      width: 450,
      icon: <UserAddOutlined style={{ color: th('colorSuccess') }} />,
      title: <ModalHeader>Add new user</ModalHeader>,
      content: (
        <>
          <p>
            Invite a new user to join your Ketty instance by typing their email
            address and clicking the Invite button below. They will receive an
            email with instructions, and their account will be activated the
            moment they sign in.
          </p>
          <Form form={inviteUserForm} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                },
                {
                  type: 'email',
                },
              ]}
            >
              <Input placeholder="Email of the user you want to invite" />
            </Form.Item>
          </Form>
        </>
      ),
      footer: [
        <ModalFooter key="new-user-footer">
          <Button key="cancel" onClick={() => newUserModal.destroy()}>
            {t('modals.deactivate.cancel')}
          </Button>
          <Button
            autoFocus
            key="add"
            onClick={() =>
              inviteUserForm
                .validateFields()
                .then(({ email }) => {
                  onInviteUser(email).then(() => {
                    newUserModal.destroy()
                  })
                })
                .catch(err => console.error(err))
            }
            // status="success"
            type="primary"
          >
            Invite
          </Button>
        </ModalFooter>,
      ],
    })
  }

  const handleResendInvitation = userId => {
    setResendingInvitation({
      text: (
        <span>
          Sending <LoadingOutlined />
        </span>
      ),
      disabled: true,
    })
    onResendInvitation(userId)
      .then(() => {
        setResendingInvitation({
          text: (
            <span>
              Sent <CheckOutlined />
            </span>
          ),
          disabled: true,
        })
        setTimeout(() => {
          setResendingInvitation({ text: 'Resend invitation' })
        }, 3000)
      })
      .catch(() => {
        setResendingInvitation({
          text: (
            <span>
              Failed <CloseOutlined />
            </span>
          ),
          disabled: true,
        })
        setTimeout(() => {
          setResendingInvitation({ text: 'Resend invitation' })
        }, 3000)
      })
  }

  return (
    <ModalContext.Provider value={null}>
      <AdminWrapper className={className}>
        <StyledCenter>
          <h1>{t('title')}</h1>
          <Table
            columns={columns}
            customActions={
              <Button onClick={handleAddNewUser} type="primary">
                Add new user
              </Button>
            }
            dataSource={parseUsers(users)}
            expandable={details}
            onSearch={onSearch}
            pagination={pagination}
            searchLabel="Search users"
            searchPlaceholder={t('table.search')}
            showSearch
            // loading={loading}
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
  onInviteUser: PropTypes.func,
  currentUser: PropTypes.shape(),
  onResendInvitation: PropTypes.func,
  onCancelInvitation: PropTypes.func,
}

UserManager.defaultProps = {
  users: [],
  totalUserCount: 0,
  currentPage: 1,
  pageSize: 10,
  onPageChange: null,
  onSearch: null,
  onDeactivate: null,
  onInviteUser: null,
  currentUser: null,
  onResendInvitation: null,
  onCancelInvitation: null,
}

export default UserManager
