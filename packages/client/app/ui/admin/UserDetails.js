import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@coko/client'
import { useTranslation } from 'react-i18next'
import { DateParser } from '@coko/client/dist/ui'

const DetailsWrapper = styled.div`
  .error {
    color: ${th('colorError')};
  }
`

const BookList = styled.ul`
  display: flex;
  flex-flow: column wrap;
  max-block-size: 12em;
`

const UserDetails = props => {
  const { user } = props

  const { t } = useTranslation(null, {
    keyPrefix: 'pages.manageUsers.table.details',
  })

  return (
    <DetailsWrapper>
      <p>
        <strong>{t('signupDate')}:</strong>{' '}
        <DateParser dateFormat="MMMM DD, YYYY, HH:mm" timestamp={user.created}>
          {timestamp => timestamp}
        </DateParser>
      </p>
      <div>
        <strong>
          {user.displayName} {t('bookList')}:
        </strong>{' '}
        {user.books?.length ? (
          <BookList>
            {user.books?.map(b => (
              <li key={b.id}>
                <Link to={`/books/${b.id}/producer`}>
                  {b.title || 'Untitled'}
                </Link>{' '}
                {b.authors[0].id === user.id ? '(author)' : ''}
              </li>
            ))}
          </BookList>
        ) : (
          <p className="error">{t('bookList.empty')}</p>
        )}
      </div>
    </DetailsWrapper>
  )
}

UserDetails.propTypes = {
  user: PropTypes.shape().isRequired,
}

export default UserDetails
