import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Upload as AntUpload } from 'antd'
import {
  CloseOutlined,
  DeleteOutlined,
  FileOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { rotate360, grid, th } from '@coko/client'
import Upload from './Upload'
import { Button, Checkbox, Each } from '../common'

const FileMapRoot = styled.li`
  align-items: center;
  background-color: #ffffff3b;
  border-bottom: 1px solid ${th('colorBorder')};
  cursor: pointer;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  padding: 10px ${grid(7)};
  transition: transform 0.3s;
  user-select: none;
  word-break: break-all;

  &[data-uploaded='false'] {
    filter: grayscale(100%);
    opacity: 0.5;
  }

  svg {
    height: 16px;
    width: 16px;
  }

  > div:first-child {
    align-items: center;
    display: flex;
    gap: 15px;

    > span > svg {
      color: ${p => p.$color};
      height: 40px;
      width: 40px;
    }
  }

  > span:nth-child(2) {
    align-items: center;
    display: flex;
    gap: 10px;
  }

  > img {
    filter: grayscale(20%);
    margin-bottom: 10px;
    opacity: 0.85;
    width: 50px;
  }
`

const FilesHeading = styled.div`
  align-items: center;
  border-block-end: 1px solid ${th('colorBorder')};
  display: flex;
  font-size: ${th('fontSizeBaseSmall')};
  gap: ${grid(6)};
  justify-content: start;
  padding: ${grid(1)} ${grid(7)};
  text-transform: uppercase;
  white-space: nowrap;

  > :last-child {
    margin-inline-start: auto;
  }
`

const StyledUpload = styled(Upload)`
  background-color: ${th('colorBackgroundHue')};
  display: block;
  overflow-y: auto;

  ul {
    margin-block: 0;
    padding-inline-start: 0;
  }
`

const StyledUploadButton = styled(AntUpload)`
  display: inline-block;

  [role='button'] {
    align-items: center;
    background-color: #307bc0;
    border-color: #307bc0;
    border-radius: 3px;
    box-shadow: none;
    color: white;
    display: flex;
    font-size: ${th('fontSizeBase')};
    height: 32px;
    justify-content: center;
    padding: ${grid(1)};
    text-align: center;
    text-transform: none;
    width: 120px;

    &&:hover {
      border-color: #307bc0;
      color: white;
    }
  }
`

const Spinner = styled.div`
  align-items: center;
  display: flex;
  height: 20px;
  justify-content: center;
  width: 40px;

  &::after {
    animation: ${rotate360} 1s linear infinite;
    border: 2px solid #00495c;
    border-color: #00495c transparent;
    border-radius: 50%;
    border-width: 1px;
    content: ' ';
    display: block;
    height: 20px;
    margin: 1px;
    width: 20px;
  }
`

const NoFiles = styled.p`
  padding-block: 20%;
`

const StyledButton = styled(Button)`
  background-color: #307bc0;
  border-color: #307bc0;
  border-radius: 3px;
  box-shadow: none;
  color: white;

  font-size: ${th('fontSizeBase')};
  width: 120px;

  &&:hover {
    border-color: #307bc0;
    color: white;
  }

  &[data-type='danger'] {
    background-color: white;
    border-color: ${th('colorError')};
    color: ${th('colorError')};

    &:hover {
      border-color: ${th('colorError')};
      color: ${th('colorError')};
    }
  }
`

const Actions = styled.div`
  display: flex;
  gap: ${grid(4)};
`

/* eslint-disable react/prop-types */
const FilesToUploadMap = ({
  filesToUpload,
  fileBeingUploaded,
  handleUpload,
  setFilesToUpload,
}) => {
  return (
    <ul>
      <Each
        of={filesToUpload}
        render={file => (
          <FileMapRoot data-uploaded="false">
            <div>
              <Checkbox disabled />
              {fileBeingUploaded === file.name ? <Spinner /> : <FileOutlined />}
              <p>
                {fileBeingUploaded === file.name
                  ? `${file.name || fileBeingUploaded}`
                  : `${file.name || fileBeingUploaded} (pending)`}
              </p>
            </div>
            {fileBeingUploaded !== file.name ? (
              <span>
                <Button
                  aria-label="Upload"
                  icon={<UploadOutlined />}
                  onClick={async () => handleUpload(file)}
                  title="Upload"
                  type="text"
                />
                <Button
                  aria-label="Remove"
                  icon={<CloseOutlined />}
                  onClick={() =>
                    setFilesToUpload(
                      filesToUpload.filter(f => f.uid !== file.uid),
                    )
                  }
                  title="Remove"
                  type="text"
                />
              </span>
            ) : (
              <span>uploading...</span>
            )}
          </FileMapRoot>
        )}
      />
    </ul>
  )
}

const FilesMap = ({
  documents,
  remove,
  selectedFiles,
  setSelectedFiles,
  xlFileExtensions,
  fileIcons,
}) => {
  const select = id => {
    setSelectedFiles(prev => {
      const temp = [...prev]
      !selectedFiles.includes(id)
        ? temp.push(id)
        : temp.splice(selectedFiles.indexOf(id), 1)
      return temp
    })
  }

  const handleRemove = (e, id) => {
    e.stopPropagation()
    e.preventDefault()
    setSelectedFiles(prev => {
      const temp = [...prev]
      temp.splice(selectedFiles.indexOf(id), 1)
      return temp
    })
    remove({ variables: { id } })
  }

  return (
    <ul>
      <Each
        of={documents}
        render={({ id, extension, name }) => {
          const ext = xlFileExtensions.includes(extension) ? 'xls' : extension
          const { icon, color } = fileIcons[ext]

          const FileIcon = icon

          return (
            <FileMapRoot $color={color} onClick={() => select(id)} title={name}>
              <div>
                <Checkbox checked={selectedFiles.includes(id)} />
                <FileIcon />
                <span>
                  <p>{name}</p>
                </span>
              </div>
              <span>
                <Button
                  aria-label="Delete file"
                  onClick={e => handleRemove(e, id)}
                  icon={<DeleteOutlined />}
                  type="text"
                  title="Delete file"
                />
              </span>
            </FileMapRoot>
          )
        }}
      />
    </ul>
  )
}
/* eslint-enable react/prop-types */

const FilesList = props => {
  const {
    filesToAccept,
    handleFileChange,
    docs,
    selectedFiles,
    bulkActions,
    noFilesNotUploads,
    fileBeingUploaded,
    filesToUpload,
    handleUpload,
    setFilesToUpload,
    deleteDocument,
    setSelectedFiles,
    xlFileExtensions,
    fileIcons,
    className,
  } = props

  return (
    <div className={className}>
      <FilesHeading>
        <Checkbox
          checked={docs.length > 0 && selectedFiles.length === docs.length}
          disabled={docs.length < 1}
          indeterminate={
            selectedFiles.length > 0 && selectedFiles.length < docs.length
          }
          onChange={bulkActions.select}
        >
          <span>Select all</span>
        </Checkbox>

        <StyledUploadButton
          accept={filesToAccept}
          aria-label="Upload files"
          customRequest={handleFileChange}
          multiple
          showUploadList={false}
        >
          Browse Files
        </StyledUploadButton>
        <Actions>
          <StyledButton
            onClick={filesToUpload.length > 0 ? bulkActions.upload : null}
          >
            Upload
          </StyledButton>
          <StyledButton onClick={bulkActions.delete} data-type="danger">
            Delete
          </StyledButton>
        </Actions>
        <p>Selected: {`${selectedFiles.length} / ${docs.length}`}</p>
      </FilesHeading>

      <StyledUpload
        accept={filesToAccept}
        customRequest={handleFileChange}
        multiple
      >
        {noFilesNotUploads && (
          <NoFiles>
            Drop and upload your documents to the knowledge base
          </NoFiles>
        )}
        <FilesToUploadMap
          fileBeingUploaded={fileBeingUploaded}
          filesToUpload={filesToUpload}
          handleUpload={handleUpload}
          setFilesToUpload={setFilesToUpload}
        />
        <FilesMap
          documents={docs}
          fileIcons={fileIcons}
          remove={deleteDocument}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          xlFileExtensions={xlFileExtensions}
        />
      </StyledUpload>
    </div>
  )
}

FilesList.propTypes = {
  bulkActions: PropTypes.shape(),
  deleteDocument: PropTypes.func,
  docs: PropTypes.instanceOf(Array),
  fileBeingUploaded: PropTypes.string,
  fileIcons: PropTypes.shape(),
  filesToAccept: PropTypes.string,
  filesToUpload: PropTypes.instanceOf(Array),
  handleFileChange: PropTypes.func,
  handleUpload: PropTypes.func,
  noFilesNotUploads: PropTypes.bool,
  selectedFiles: PropTypes.instanceOf(Array),
  setFilesToUpload: PropTypes.func,
  setSelectedFiles: PropTypes.func,
  xlFileExtensions: PropTypes.instanceOf(Array),
}

FilesList.defaultProps = {
  bulkActions: null,
  deleteDocument: null,
  docs: [],
  fileBeingUploaded: '',
  fileIcons: null,
  filesToAccept: '',
  filesToUpload: [],
  handleFileChange: null,
  handleUpload: null,
  noFilesNotUploads: false,
  selectedFiles: [],
  setFilesToUpload: null,
  setSelectedFiles: null,
  xlFileExtensions: [],
}

export default FilesList
