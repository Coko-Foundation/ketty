import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { notification } from 'antd'
import {
  DownloadOutlined,
  CheckCircleTwoTone,
  WarningTwoTone,
} from '@ant-design/icons'

import { grid, th } from '@coko/client'

import { Button, Cluster, Input, Modal, Spin } from '../common'

const Wrapper = styled.div`
  background-color: ${th('colorBackground')};
  bottom: 0;
  margin-block-start: auto;
  padding-block: ${grid(4)};
  position: absolute;
  width: 500px;
  z-index: 9;
`

const Footer = props => {
  const {
    className,
    createProfile,
    canModify,
    isNewProfileSelected,
    loadingPreview,
    onClickDownload,
    selectedFormat,
    onPublish,
    publishing,
    publishingAssets,
    luluInformation,
    selectedTemplate,
  } = props

  const {
    includePdf,
    includeEpub,
    missingPdfProfile,
    missingEpubProfile,
    publishedBefore,
  } = publishingAssets

  const {
    canUploadToProvider,
    isConnected,
    isInLulu,
    isSynced,
    onClickSendToLulu,
  } = luluInformation

  const [createLoading, setCreateLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPublishModalOpen, setPublishModalOpen] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [createInput, setCreateInput] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isCreateModalOpen && inputRef && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      })
    }
  }, [isCreateModalOpen])

  const [notificationApi, notificationContextHolder] =
    notification.useNotification()

  const notify = (type, text) => {
    const messageMapper = {
      success: 'Success',
      error: 'Error',
    }

    notificationApi[type]({
      message: messageMapper[type],
      description: text,
    })
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    setCreateInput(null)
  }

  const handleClickDownload = () => {
    if (loadingPreview) return

    setDownloadLoading(true)

    onClickDownload()
      .catch(() => {
        notify('error', 'Something went wrong while creating your file!')
      })
      .finally(() => {
        setDownloadLoading(false)
      })
  }

  const handleCreate = () => {
    setCreateLoading(true)

    createProfile(createInput)
      .then(() => {
        notify('success', 'Profile created')
      })
      .catch(err => {
        console.error(err)

        notify(
          'error',
          'Something went wrong while trying to create this profile',
        )
      })
      .finally(() => {
        setCreateLoading(false)
        closeCreateModal()
      })
  }

  const handleClickSave = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateInputChange = val => {
    setCreateInput(val)
  }

  const handleInputKeyDown = e => {
    if (e.key === 'Enter') handleCreate()
  }

  const handlePublish = () => {
    onPublish().finally(() => {
      setPublishModalOpen(false)
    })
  }

  const handleClickSendToLulu = () => {
    setUploading(true)

    onClickSendToLulu().finally(() => {
      setUploading(false)
    })
  }

  const publishingModalContent = (missingPdf, missingEpub, loading) => {
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
          Your book will be published at a unique URL. You can update and
          republish it anytime.
        </p>

        <p>
          Publishing may take a few minutes. Once complete, the book will open
          in a new browser tab.
        </p>
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
        {publishedBefore && (
          <p>
            <WarningTwoTone twoToneColor="#ffc300" /> Careful: Publishing again
            will overwrite the previously published book.
          </p>
        )}
      </>
    )
  }

  const renderFooterActions = () => {
    const actions = []

    if (isNewProfileSelected) {
      actions.push(
        <Button
          data-test="preview-save-btn"
          disabled={loadingPreview || !canModify}
          key="save-profile"
          onClick={handleClickSave}
        >
          Save Publishing Profile
        </Button>,
      )
    } else if (selectedFormat === 'web') {
      actions.push(
        <Button
          disabled={loadingPreview || !onPublish}
          key="publish-online"
          onClick={() => setPublishModalOpen(true)}
          type="primary"
        >
          {publishedBefore ? 'Publish Again' : 'Publish'}
        </Button>,
      )
    } else if (isConnected && !isInLulu && canUploadToProvider) {
      actions.push(
        <Button
          disabled={isUploading}
          key="upload-to-lulu"
          loading={isUploading}
          onClick={handleClickSendToLulu}
          type="primary"
        >
          Upload to Lulu
        </Button>,
      )
    } else if (isConnected && isInLulu && !isSynced) {
      actions.push(
        <Button
          disabled={isUploading}
          key="lulu-sync"
          loading={isUploading}
          onClick={handleClickSendToLulu}
          type="primary"
        >
          Sync With Lulu
        </Button>,
      )
    }

    if (selectedFormat !== 'web') {
      actions.push(
        <Button
          data-test="preview-download-btn"
          icon={<DownloadOutlined />}
          key="download"
          loading={downloadLoading}
          onClick={handleClickDownload}
        >
          Download
        </Button>,
      )
    }

    return actions
  }

  return (
    <Wrapper className={className}>
      {notificationContextHolder}

      <Cluster>{renderFooterActions().map(action => action)}</Cluster>

      <Modal
        confirmLoading={createLoading}
        onCancel={closeCreateModal}
        onOk={handleCreate}
        open={isCreateModalOpen}
        title="Save Publishing Profile"
      >
        <Input
          data-test="preview-exportName-input"
          onChange={handleCreateInputChange}
          onKeyDown={handleInputKeyDown}
          ref={inputRef}
          value={createInput}
        />
      </Modal>

      <Modal
        maskClosable={!publishing}
        okButtonProps={{
          disabled: missingPdfProfile || missingEpubProfile || publishing,
        }}
        okText="Publish"
        onCancel={() => setPublishModalOpen(false)}
        onOk={handlePublish}
        open={isPublishModalOpen}
        title="Publish Online"
      >
        {publishingModalContent(
          missingPdfProfile,
          missingEpubProfile,
          publishing,
        )}
      </Modal>
    </Wrapper>
  )
}

Footer.propTypes = {
  createProfile: PropTypes.func.isRequired,
  canModify: PropTypes.bool.isRequired,
  isNewProfileSelected: PropTypes.bool.isRequired,
  loadingPreview: PropTypes.bool.isRequired,
  onClickDownload: PropTypes.func.isRequired,
  onPublish: PropTypes.func,
  selectedFormat: PropTypes.string,
  publishingAssets: PropTypes.shape(),
  publishing: PropTypes.bool,
  luluInformation: PropTypes.shape(),
  selectedTemplate: PropTypes.shape(),
}

Footer.defaultProps = {
  selectedFormat: 'pdf',
  onPublish: null,
  publishing: false,
  publishingAssets: {
    missingPdfProfile: false,
    missingEpubProfile: false,
    includePdf: false,
    includeEpub: false,
    publishedBefore: false,
  },
  luluInformation: {
    isConnected: false,
  },
  selectedTemplate: {
    name: '',
  },
}

export default Footer
