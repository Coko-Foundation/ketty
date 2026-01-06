import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Avatar } from 'antd'
import { grid } from '@coko/client'
import { List, Select } from '../../common'
import { getInitials } from '../../../utils'

const StyledListItem = styled.div`
  padding: 12px 0;
  width: 100%;
`

const UserRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const UserDetails = styled.div`
  align-items: center;
  display: flex;
  gap: ${grid(2)};
`

const OwnerLabel = styled.span`
  padding: 0 12px;
`

const StyledAvatar = styled(Avatar)`
  font-weight: bold;
`

const StyledSelect = styled(Select)`
  width: fit-content;
`

const UserListItem = ({
  id,
  onChangeAccess,
  onRemoveAccess,
  role,
  status,
  teamId,
  canChangeAccess,
  user,
}) => {
  const { t } = useTranslation(null, {
    keyPrefix: 'pages.common.header.shareModal.permissions',
  })

  const dropdownItems = [
    { value: 'read', label: t('options.view') },
    { value: 'write', label: t('options.edit') },
    { value: 'remove', label: t('options.remove') },
  ]

  const { displayName, id: userId, email, avatar } = user

  return (
    <StyledListItem key={id}>
      <UserRow>
        <UserDetails>
          <StyledAvatar src={avatar?.url}>
            {getInitials(displayName)}
          </StyledAvatar>
          <span>{displayName}</span>
        </UserDetails>
        {role === 'owner' ? (
          <OwnerLabel>{t('options.owner')}</OwnerLabel>
        ) : (
          <StyledSelect
            bordered={false}
            defaultValue={status}
            disabled={!canChangeAccess}
            onChange={value => {
              if (value === 'remove') {
                onRemoveAccess({ teamId, userId, email }, role)
              } else {
                onChangeAccess({ teamMemberId: id, value, email }, role)
              }
            }}
            options={dropdownItems}
          />
        )}
      </UserRow>
    </StyledListItem>
  )
}

UserListItem.propTypes = {
  id: PropTypes.string.isRequired,
  onChangeAccess: PropTypes.func.isRequired,
  onRemoveAccess: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  status: PropTypes.string,
  teamId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    email: PropTypes.string,
    avatar: PropTypes.shape(),
  }).isRequired,
  canChangeAccess: PropTypes.bool.isRequired,
}

UserListItem.defaultProps = {
  status: null,
}

const UserList = ({
  bookTeams,
  onChangeAccess,
  onRemoveAccess,
  loading,
  canChangeAccess,
  className,
}) => {
  return bookTeams.map(
    team =>
      team.members.length > 0 && (
        <List
          className={className}
          dataSource={team.members}
          key={team.id}
          loading={loading}
          renderItem={member => (
            <UserListItem
              canChangeAccess={canChangeAccess}
              onChangeAccess={onChangeAccess}
              onRemoveAccess={onRemoveAccess}
              role={team.role}
              teamId={team.id}
              {...member}
            />
          )}
          showPagination={false}
        />
      ),
  )
}

UserList.propTypes = {
  bookTeams: PropTypes.arrayOf(
    PropTypes.shape({
      members: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          user: PropTypes.shape({
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
          }),
        }),
      ),
      id: PropTypes.string,
      role: PropTypes.string,
    }),
  ).isRequired,
  onChangeAccess: PropTypes.func.isRequired,
  onRemoveAccess: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  canChangeAccess: PropTypes.bool.isRequired,
}

export default UserList
