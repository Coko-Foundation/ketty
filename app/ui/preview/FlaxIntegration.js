/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import { Button } from '../common'

const FlaxIntegration = props => {
  const { webPublishInfo, profiles } = props

  return (
    <div>
      <h3 style={{ marginBlock: 0 }}>Flax integration:</h3>
      {webPublishInfo?.published ? (
        <>
          <p>
            Last published:{' '}
            {new Intl.DateTimeFormat('en-GB', {
              dateStyle: 'medium',
              timeStyle: 'long',
            }).format(new Date(webPublishInfo?.lastUpdated))}
          </p>
          <p>
            Published with profile:{' '}
            {profiles.find(p => p.value === webPublishInfo.profileId)?.label}
          </p>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Button
              onClick={() =>
                window.open(webPublishInfo?.publicUrl, '_blank', 'noreferrer')
              }
            >
              Open Published Book
            </Button>
          </div>
        </>
      ) : (
        <p>Not published yet</p>
      )}
    </div>
  )
}

FlaxIntegration.propTypes = {
  webPublishInfo: PropTypes.shape(),
  profiles: PropTypes.arrayOf(PropTypes.shape()),
}

FlaxIntegration.defaultProps = {
  webPublishInfo: null,
  profiles: null,
}

export default FlaxIntegration
