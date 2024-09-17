import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { notification } from 'antd'
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons'

// import { grid, th } from '@coko/client'

import { Button, ButtonGroup, Input, Modal } from '../common'

const Wrapper = styled.div`
  margin-block-start: auto;
`

const Footer = props => {
  const {
    className,
    createProfile,
    canModify,
    isDownloadButtonDisabled,
    isNewProfileSelected,
    isSaveDisabled,
    loadingPreview,
    onClickDelete,
    onClickDownload,
    updateProfile,
    selectedFormat,
  } = props

  const [deleteLoading, setDeleteLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
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

  const handleClickDelete = () => {
    if (loadingPreview) return // handle here to prevent flashing

    setDeleteLoading(true)

    onClickDelete()
      .then(() => {
        notify('success', 'Profile has been deleted')
      })
      .catch(() => {
        notify(
          'error',
          'Something went wrong while trying to delete this profile',
        )
      })
      .finally(() => {
        setDeleteLoading(false)
      })
  }

  const handleClickDownload = () => {
    if (loadingPreview) return

    setDownloadLoading(true)

    onClickDownload()
      // .then(() => {
      //   notify('success', 'Download started')
      // })
      .catch(() => {
        notify('error', 'Something went wrong while creating your file!')
      })
      .finally(() => {
        setDownloadLoading(false)
      })
  }

  const handleUpdate = () => {
    setUpdateLoading(true)

    updateProfile()
      .then(() => {
        notify('success', 'Profile saved')
      })
      .catch(() => {
        notify(
          'error',
          'Something went wrong while trying to save this profile',
        )
      })
      .finally(() => {
        setUpdateLoading(false)
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
    if (loadingPreview) return null

    if (isNewProfileSelected) {
      setIsCreateModalOpen(true)
      return null
    }

    return handleUpdate()
  }

  const handleCreateInputChange = val => {
    setCreateInput(val)
  }

  const handleInputKeyDown = e => {
    if (e.key === 'Enter') handleCreate()
  }

  return (
    <Wrapper className={className}>
      {notificationContextHolder}

      <ButtonGroup>
        {canModify && (
          <Button
            // disabled={isSaveDisabled || updateLoading || loadingPreview}
            disabled={isSaveDisabled || updateLoading || !canModify}
            loading={updateLoading}
            onClick={handleClickSave}
            data-test="preview-save-btn"
          >
            {isNewProfileSelected
              ? 'Save Publishing Profile'
              : 'Update Profile'}
          </Button>
        )}

        {/* <Button
            // disabled={isDownloadButtonDisabled || loadingPreview}
            disabled={isDownloadButtonDisabled}
            loading={downloadLoading}
            onClick={handleClickDownload}
            type="primary"
          >
            Publish Online
          </Button> */}
        {selectedFormat !== 'web' && (
          <Button
            // disabled={isDownloadButtonDisabled || loadingPreview}
            data-test="preview-download-btn"
            disabled={isDownloadButtonDisabled}
            icon={<DownloadOutlined />}
            loading={downloadLoading}
            onClick={handleClickDownload}
          >
            Download
          </Button>
        )}

        {!isNewProfileSelected && (
          <Button
            // disabled={updateLoading || loadingPreview}
            disabled={updateLoading || !canModify}
            icon={<DeleteOutlined />}
            loading={deleteLoading}
            onClick={handleClickDelete}
            status="danger"
            data-test="preview-delete-btn"
          >
            Delete
          </Button>
        )}
      </ButtonGroup>

      <Modal
        confirmLoading={createLoading}
        onCancel={closeCreateModal}
        onOk={handleCreate}
        open={isCreateModalOpen}
        title="Save export"
      >
        <Input
          data-test="preview-exportName-input"
          onChange={handleCreateInputChange}
          onKeyDown={handleInputKeyDown}
          ref={inputRef}
          value={createInput}
        />
      </Modal>
    </Wrapper>
  )
}

Footer.propTypes = {
  createProfile: PropTypes.func.isRequired,
  canModify: PropTypes.bool.isRequired,
  isDownloadButtonDisabled: PropTypes.bool.isRequired,
  isNewProfileSelected: PropTypes.bool.isRequired,
  isSaveDisabled: PropTypes.bool.isRequired,
  loadingPreview: PropTypes.bool.isRequired,
  onClickDelete: PropTypes.func,
  onClickDownload: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  selectedFormat: PropTypes.string,
}

Footer.defaultProps = {
  onClickDelete: null,
  selectedFormat: 'pdf',
}

export default Footer
