import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from '../common'

const FlaxIntegration = props => {
  const { onPublish, includePdf, includeEpub, profiles } = props
  const [isPublishModalOpen, setPublishModalOpen] = useState(false)

  const handlePublish = () => {
    onPublish().finally(() => {
      setPublishModalOpen(false)
    })
  }

  return (
    <div>
      <Button onClick={() => setPublishModalOpen(true)} type="primary">
        Publish Online
      </Button>

      <Modal
        onCancel={() => setPublishModalOpen(false)}
        onOk={handlePublish}
        open={isPublishModalOpen}
        title="Publish Online"
      >
        <p>Are you ready to publish?</p>

        <p>Include PDF: {String(includePdf)}</p>
        {includePdf && (
          <>
            <p>Available pdf profiles:</p>
            <ul>
              {profiles
                .filter(p => p.format === 'pdf')
                .map(p => (
                  <li>{p.label}</li>
                ))}
            </ul>
          </>
        )}
        <p>Include EPUB: {String(includeEpub)}</p>
        {includeEpub && (
          <>
            <p>Available pdf profiles:</p>
            <ul>
              {profiles
                .filter(p => p.format === 'epub')
                .map(p => (
                  <li>{p.label}</li>
                ))}
            </ul>
          </>
        )}
      </Modal>
    </div>
  )
}

FlaxIntegration.propTypes = {
  onPublish: PropTypes.func,
  includePdf: PropTypes.bool,
  includeEpub: PropTypes.bool,
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
      size: PropTypes.string,
      content: PropTypes.arrayOf(PropTypes.string).isRequired,
      template: PropTypes.string,
      synced: PropTypes.bool,
      lastSynced: PropTypes.string,
      projectId: PropTypes.string,
      projectUrl: PropTypes.string,
    }),
  ),
}

FlaxIntegration.defaultProps = {
  onPublish: null,
  includePdf: false,
  includeEpub: false,
  profiles: [],
}

export default FlaxIntegration
