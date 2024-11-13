/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { Button } from '../common'

const FlaxIntegration = props => {
  const { webPublishInfo, profiles } = props
  const { t } = useTranslation()

  return (
    <div>
      <h3 style={{ marginBlock: 0 }}>{t('flax_integration')}:</h3>
      {webPublishInfo?.published ? (
        <>
          <p>
            {t('flax_last_published')}:{' '}
            {new Intl.DateTimeFormat('en-GB', {
              dateStyle: 'medium',
              timeStyle: 'long',
            }).format(new Date(webPublishInfo?.lastUpdated))}
          </p>
          <p>
            {t('flax_published_with_profile')}:{' '}
            {profiles.find(p => p.value === webPublishInfo.profileId)?.label}
          </p>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Button
              onClick={() =>
                window.open(webPublishInfo?.publicUrl, '_blank', 'noreferrer')
              }
            >
              {t('flax_open_published')}
            </Button>
          </div>
        </>
      ) : (
        <p>{t('flax_not_published')}</p>
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
