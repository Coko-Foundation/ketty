import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { notification } from 'antd'
import {
  DownloadOutlined,
  CheckCircleTwoTone,
  WarningTwoTone,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

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
      return <p>{t('webpublish_modal_missing_pdf')}</p>
    }

    if (missingEpub) {
      return <p>{t('webpublish_modal_missing_epub')}</p>
    }

    return loading ? (
      <div style={{ textAlign: 'center' }}>
        <Spin />
        <p>{t('publishing_loading')}</p>
      </div>
    ) : (
      <>
        <p>{t('webpublish_modal_info_1')}</p>

        <p>{t('webpublish_modal_info_2')}</p>
        <p>
          {t('webpublish_modal_selected_template')}{' '}
          <span style={{ textTransform: 'capitalize' }}>
            {selectedTemplate?.name}
          </span>
        </p>
        {includePdf && (
          <p>
            <CheckCircleTwoTone twoToneColor="green" />{' '}
            {t('webpublish_modal_include_pdf')}
          </p>
        )}
        {includeEpub && (
          <p>
            <CheckCircleTwoTone twoToneColor="green" />{' '}
            {t('webpublish_modal_include_epub')}
          </p>
        )}
        {publishedBefore && (
          <p>
            <WarningTwoTone twoToneColor="#ffc300" />{' '}
            {t('webpublish_modal_warning')}
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
          {t('save_publishin_profile')}
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
          {publishedBefore ? t('publish_again_action') : t('publish_action')}
        </Button>,
      )
    } else if (isConnected && !isInLulu && canUploadToProvider) {
      actions.push(
        <Button
          disabled={isUploading}
          key="upload-to-lulu"
          loading={isUploading}
          onClick={handleClickSendToLulu}
          style={{ textTransform: 'none' }}
          type="primary"
        >
          {t('upload_to_lulu')}
        </Button>,
      )
    } else if (isConnected && isInLulu && !isSynced) {
      actions.push(
        <Button
          disabled={isUploading}
          key="lulu-sync"
          loading={isUploading}
          onClick={handleClickSendToLulu}
          style={{ textTransform: 'none' }}
          type="primary"
        >
          {t('sync_with_lulu')}
        </Button>,
      )
    }

    if (selectedFormat !== 'web') {
      actions.push(
        <Button
          data-test="preview-download-btn"
          disabled={loadingPreview || !canModify}
          icon={<DownloadOutlined />}
          key="download"
          loading={downloadLoading}
          onClick={handleClickDownload}
        >
          {t('download')}
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
        title={t('save_publishing_profile')}
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
        okText={t('publish_action')}
        onCancel={() => setPublishModalOpen(false)}
        onOk={handlePublish}
        open={isPublishModalOpen}
        title={t('publish_online')}
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
