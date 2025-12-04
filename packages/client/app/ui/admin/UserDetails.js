import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DateParser } from '@coko/client/dist/ui'

const DetailsWrapper = styled.div``

const BookList = styled.ul`
  display: flex;
  flex-flow: column wrap;
  max-block-size: 12em;
`

const UserDetails = props => {
  const { user } = props
  return (
    <DetailsWrapper>
      <p>
        Signup date:{' '}
        <DateParser dateFormat="MMMM DD, YYYY, HH:mm" timestamp={user.created}>
          {timestamp => timestamp}
        </DateParser>
      </p>
      <div>
        This user has access to the following books:{' '}
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
          <span>This user has not created any books</span>
        )}
      </div>
    </DetailsWrapper>
  )
}

UserDetails.propTypes = {
  user: PropTypes.shape().isRequired,
}

export default UserDetails
