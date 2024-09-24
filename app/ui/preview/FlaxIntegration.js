/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { Button, Modal, Spin } from '../common'

const FlaxIntegration = props => {
  const {
    includePdf,
    includeEpub,
    selectedTemplate,
    pdfProfile,
    epubProfile,
    publishing,
    onPublish,
    onUnpublish,
    webPublishInfo,
    previewLoading,
  } = props

  const [isPublishModalOpen, setPublishModalOpen] = useState(false)
  const [isUnPublishModalOpen, setUnPublishModalOpen] = useState(false)

  const handlePublish = () => {
    onPublish().finally(() => {
      setPublishModalOpen(false)
    })
  }

  const handleUnPublish = () => {
    onUnpublish().finally(() => {
      setPublishModalOpen(false)
    })
  }

  const missingPdfProfile = includePdf && !pdfProfile
  const missingEpubProfile = includeEpub && !epubProfile

  const modalContent = (missingPdf, missingEpub, loading) => {
    if (missingPdf) {
      return (
        <p>
          You need to select a PDF profile if you want to include a PDF in your
          website
        </p>
      )
    }

    if (missingEpub) {
      return (
        <p>
          You need to select an EPUB profile if you want to include an EPUB in
          your website
        </p>
      )
    }

    return loading ? (
      <div style={{ textAlign: 'center' }}>
        <Spin />
        <p>Publishing</p>
      </div>
    ) : (
      <>
        <p>
          Selected template:{' '}
          <span style={{ textTransform: 'capitalize' }}>
            {selectedTemplate?.name}
          </span>
        </p>
        {includePdf && (
          <p>
            <CheckCircleTwoTone twoToneColor="green" /> Includes PDF download
          </p>
        )}
        {includeEpub && (
          <p>
            <CheckCircleTwoTone twoToneColor="green" /> Includes EPUB download
          </p>
        )}
      </>
    )
  }

  return (
    <div>
      {webPublishInfo?.published ? (
        <>
          <p>
            Last published:{' '}
            {new Intl.DateTimeFormat('en-GB', {
              dateStyle: 'full',
              timeStyle: 'long',
            }).format(new Date(webPublishInfo?.lastUpdated))}
          </p>
          <div style={{ display: 'flex', gap: '2em' }}>
            <Button
              onClick={() =>
                window.open(webPublishInfo?.publicUrl, '_blank', 'noreferrer')
              }
            >
              Open published book
            </Button>

            <Button
              disabled={previewLoading}
              onClick={() => setPublishModalOpen(true)}
              type="primary"
            >
              Publish again
            </Button>

            {onUnpublish ? (
              <Button
                disabled={previewLoading}
                onClick={() => setUnPublishModalOpen(true)}
                status="danger"
              >
                Unpublish
              </Button>
            ) : null}
          </div>
          <p>
            Careful: Publishing again will overwrite the previously published
            book.
          </p>
        </>
      ) : (
        <Button
          disabled={publishing || previewLoading}
          onClick={() => setPublishModalOpen(true)}
          type="primary"
        >
          {!publishing ? 'Publish Online' : 'Publishing...'}
        </Button>
      )}

      <Modal
        maskClosable={!publishing}
        okButtonProps={{
          disabled: missingPdfProfile || missingEpubProfile || publishing,
        }}
        okText="Publish"
        onCancel={() => setPublishModalOpen(false)}
        onOk={handlePublish}
        open={isPublishModalOpen}
        title="Publish Book Website"
      >
        {modalContent(missingPdfProfile, missingEpubProfile, publishing)}
      </Modal>

      <Modal
        okText="Unpublish"
        onCancel={() => setUnPublishModalOpen(false)}
        onOk={handleUnPublish}
        open={isUnPublishModalOpen}
        title="Unpublish Book Website"
      >
        Warning: This action will make the book published at{' '}
        {webPublishInfo?.url} unavailalbe. Are you sure you want to unpublish?
      </Modal>
    </div>
  )
}

FlaxIntegration.propTypes = {
  onPublish: PropTypes.func,
  onUnpublish: PropTypes.func,
  includePdf: PropTypes.bool,
  includeEpub: PropTypes.bool,
  selectedTemplate: PropTypes.shape(),
  webPublishInfo: PropTypes.shape(),
  previewLoading: PropTypes.bool,
}

FlaxIntegration.defaultProps = {
  onPublish: null,
  onUnpublish: null,
  includePdf: false,
  includeEpub: false,
  selectedTemplate: null,
  webPublishInfo: null,
  previewLoading: false,
}

export default FlaxIntegration
