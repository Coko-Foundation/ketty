/* stylelint-disable declaration-no-important */
import React from 'react'
import { Upload } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const { Dragger } = Upload

const StyledDragger = styled(Dragger)`
  height: 100% !important;

  .ant-upload-drag-container,
  .ant-upload-drag {
    background: #f8f8f8;
    border: none !important;
    cursor: unset !important;
    display: flex !important;
    flex-direction: column !important;
    height: calc(100% - 15px) !important;
    margin: 0;
    outline: none !important;
    width: 100% !important;

    &:hover {
      border: none !important;
      outline: none !important;
    }
  }

  .ant-upload-btn {
    display: flex !important;
    height: 100% !important;
    padding: 0 !important;
  }

  &:hover {
    .ant-upload-drag-container,
    .ant-upload-drag .ant-upload-btn {
      border: none !important;
      outline: none !important;
    }
  }
`

const UploadHiddenDropZone = props => {
  return (
    <StyledDragger
      {...props}
      action=""
      aria-label="Drop files here to upload"
      openFileDialogOnClick={false}
      showUploadList={false}
    />
  )
}

UploadHiddenDropZone.propTypes = {
  onFileSelect: PropTypes.func,
}

UploadHiddenDropZone.defaultProps = {
  onFileSelect: () => {},
}

export default UploadHiddenDropZone
