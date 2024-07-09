import React, { useContext } from 'react'
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
import { GlobalContext } from '../../helpers/hooks/GlobalContext'

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
  flex-grow: 1;
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
    cursor: pointer;
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

    &[disabled] {
      background-color: rgba(85 85 85 / 4%);
      border-color: ${th('colorSecondary')};
      color: rgba(85 85 85 / 25%);
    }
  }

  &[data-type='danger'] {
    background-color: white;
    border-color: ${th('colorError')};
    color: ${th('colorError')};

    &:hover {
      border-color: ${th('colorError')};
      color: ${th('colorError')};
    }

    &[disabled] {
      background-color: rgba(85 85 85 / 4%);
      border-color: ${th('colorSecondary')};
      color: rgba(85 85 85 / 25%);
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
  filesBeingUploaded,
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
              {filesBeingUploaded.indexOf(file.uid) !== -1 ? (
                <Spinner />
              ) : (
                <FileOutlined />
              )}
              <p>
                {filesBeingUploaded[0] === file.uid
                  ? `${file.name}`
                  : `${file.name} (pending)`}
              </p>
            </div>
            {filesBeingUploaded.indexOf(file.uid) === -1 ? (
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
    remove(id)
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
                  icon={<DeleteOutlined />}
                  onClick={e => handleRemove(e, id)}
                  title="Delete file"
                  type="text"
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
    handleUpload,
    deleteDocument,
    setSelectedFiles,
    xlFileExtensions,
    fileIcons,
    className,
  } = props

  const { filesToUpload, setFilesToUpload, filesBeingUploaded } =
    useContext(GlobalContext)

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
          Add Files
        </StyledUploadButton>
        <Actions>
          <StyledButton
            aria-label="Upload pending files"
            disabled={
              filesToUpload.length === 0 || filesBeingUploaded.length > 0
            }
            onClick={bulkActions.upload}
          >
            Upload All
          </StyledButton>
          <StyledButton
            aria-label="Delete selected files"
            data-type="danger"
            disabled={selectedFiles.length === 0}
            onClick={bulkActions.delete}
          >
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
          filesBeingUploaded={filesBeingUploaded}
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
  fileIcons: PropTypes.shape(),
  filesToAccept: PropTypes.string,
  handleFileChange: PropTypes.func,
  handleUpload: PropTypes.func,
  noFilesNotUploads: PropTypes.bool,
  selectedFiles: PropTypes.instanceOf(Array),
  setSelectedFiles: PropTypes.func,
  xlFileExtensions: PropTypes.instanceOf(Array),
}

FilesList.defaultProps = {
  bulkActions: null,
  deleteDocument: null,
  docs: [],
  fileIcons: null,
  filesToAccept: '',
  handleFileChange: null,
  handleUpload: null,
  noFilesNotUploads: false,
  selectedFiles: [],
  setSelectedFiles: null,
  xlFileExtensions: [],
}

export default FilesList
