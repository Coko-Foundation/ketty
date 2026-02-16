/* stylelint-disable declaration-no-important */
import React, { useState, useEffect } from 'react'
import { Typography, Upload as AntUpload } from 'antd'
import { grid } from '@coko/client'
import { CloseOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import Button from './Button'

const { Text } = Typography
const { Dragger } = AntUpload

const StyledDragger = styled(Dragger)`
  .ant-upload {
    display: grid !important;
    max-inline-size: 500px;
    padding: ${grid(4)};
    place-content: center;
  }

  .ant-upload-drag-container {
    display: block;
    margin: 0;
    max-height: 100%;
  }

  .ant-upload-btn {
    display: flex;
    justify-content: center;
    min-height: 300px;
  }
`

const FileInfoText = styled(Text)`
  text-align: left;
`

const FileList = styled.ul`
  max-height: 200px;
  overflow-y: auto;
  padding: 0;

  li {
    display: flex;
    justify-content: space-between;
    list-style-type: none;
  }
`

const Upload = props => {
  const { multiple, onFilesChange } = props

  const [files, setFiles] = useState([])

  useEffect(() => {
    onFilesChange(files)
  }, [files])

  const onFileSelect = ({ file }) => {
    if (multiple) {
      setFiles(prevFiles => [...prevFiles, file])
    } else {
      setFiles([file])
    }
  }

  const onClickRemove = (evt, file) => {
    evt.stopPropagation()
    removeFile(file)
  }

  const removeFile = fileToRemove => {
    setFiles(files.filter(file => file.uid !== fileToRemove.uid))
  }

  return (
    <StyledDragger
      {...props}
      action=""
      customRequest={onFileSelect}
      showUploadList={false}
    >
      <Text>
        <Trans i18nKey="pages.newBook.importPage.dropArea">
          Drag and drop files, or <Text underline>browse</Text>
        </Trans>
      </Text>
      <FileList>
        {files.length > 0 &&
          files.map(file => (
            <li key={file.uid}>
              <FileInfoText ellipsis={{ tooltip: file.name }} strong>
                {file.name}
              </FileInfoText>
              <Button
                icon={<CloseOutlined />}
                onClick={evt => onClickRemove(evt, file)}
                style={{ padding: '0' }}
                type="ghost"
              />
            </li>
          ))}
      </FileList>
    </StyledDragger>
  )
}

Upload.propTypes = {
  multiple: PropTypes.bool,
  onFilesChange: PropTypes.func,
}

Upload.defaultProps = {
  multiple: false,
  onFilesChange: () => {},
}

export default Upload
