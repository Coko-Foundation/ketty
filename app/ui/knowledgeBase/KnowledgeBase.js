import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  FileExcelOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from '@ant-design/icons'
import { grid, th } from '@coko/client'
import { keys } from 'lodash'
import FilesList from './FilesList'
// import ActionsSidebar from './ActionsSidebar'
// import KBHeader from './KBHeader'

const xlFileExtensions = [
  '.xls',
  '.xlsb',
  '.xlsm',
  '.xlsx',
  '.xlt',
  '.xltm',
  '.xltx',
]

const fileIcons = {
  md: { icon: FileMarkdownOutlined, color: '#625286' },
  docx: { icon: FileWordOutlined, color: '#3054a0' },
  pdf: { icon: FilePdfOutlined, color: '#b82727' },
  xmls: { icon: FileExcelOutlined, color: '#429d50' },
  xls: { icon: FileExcelOutlined, color: '#429d50' },
}

const Wrapper = styled.div`
  /* display: grid;
  grid-template:
    'header sidebar' 70px 'main sidebar' 1fr /
    1fr minmax(25%, 250px); */
  display: block;

  height: 100%;
  overflow: hidden;
  position: relative;

  * {
    ::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }

    ::-webkit-scrollbar-thumb {
      background: ${th('colorSecondary')};
      border-radius: 5px;
      width: 5px;
    }

    ::-webkit-scrollbar-track {
      background: #fff0;
      padding: 5px;
    }
  }

  .ant-spin-container,
  .ant-spin-nested-loading {
    height: 100%;
  }
`

const FileList = styled(FilesList)`
  height: 100%;
`

const Header = styled.div`
  align-items: center;
  border-block-end: 1px solid ${th('colorBorder')};
  display: flex;
  justify-content: space-between;
  padding: ${grid(2)} ${grid(7)};
  white-space: nowrap;

  h2 {
    color: ${th('colorTextLight')};
    font-size: 28px;
    margin: 0;
  }
`

const KnowledgeBase = props => {
  const { bookId, docs, createDocument, deleteDocument } = props

  const [selectedFiles, setSelectedFiles] = useState([])
  const [filesToUpload, setFilesToUpload] = useState([])
  const [fileBeingUploaded, setFileBeingUploaded] = useState('')

  const scrollToTopOfFilesList = () => {
    document
      .querySelector('.ant-upload-wrapper') // [1] as long as the other Upload exists on header
      .scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const handleFileChange = ({ file }) => {
    setFilesToUpload(prevFiles => [...prevFiles, file])
    scrollToTopOfFilesList()
  }

  const handleUpload = async file => {
    setFileBeingUploaded(file.name)
    await createDocument({ variables: { file, bookId } })
    setFilesToUpload(currentFiles =>
      currentFiles.filter(f => f.uid !== file.uid),
    )
    setFileBeingUploaded('')
  }

  const bulkActions = {
    async upload() {
      try {
        // eslint-disable-next-line no-restricted-syntax
        for await (const file of filesToUpload) {
          await handleUpload(file)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async delete() {
      if (selectedFiles.length < 1) return

      try {
        await Promise.all(
          selectedFiles.map(async id => {
            deleteDocument({ variables: { id } })
          }),
        )
      } catch (error) {
        console.error(error)
      } finally {
        setSelectedFiles([])
      }
    },
    select() {
      selectedFiles.length === docs.length
        ? setSelectedFiles([])
        : setSelectedFiles(docs.map(({ id }) => id))
    },
  }

  const filesToAccept = keys(fileIcons)
    .map(k => `.${k}`)
    .concat(xlFileExtensions)
    .join(',')

  const noFilesNotUploads =
    fileBeingUploaded.length < 1 && docs.length < 1 && filesToUpload.length < 1

  return (
    <Wrapper>
      <Header>
        <h2>Knowledge Base</h2>
      </Header>
      <FileList
        bulkActions={bulkActions}
        deleteDocument={deleteDocument}
        docs={docs}
        fileBeingUploaded={fileBeingUploaded}
        fileIcons={fileIcons}
        filesToAccept={filesToAccept}
        filesToUpload={filesToUpload}
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
        noFilesNotUploads={noFilesNotUploads}
        selectedFiles={selectedFiles}
        setFilesToUpload={setFilesToUpload}
        setSelectedFiles={setSelectedFiles}
        xlFileExtensions={xlFileExtensions}
      />
      {/* <Sidebar
        bulkActions={bulkActions}
        filesToUpload={filesToUpload}
        selectedFiles={selectedFiles}
      /> */}
    </Wrapper>
  )
}

KnowledgeBase.propTypes = {
  bookId: PropTypes.string.isRequired,
  docs: PropTypes.instanceOf(Array),
  createDocument: PropTypes.func,
  deleteDocument: PropTypes.func,
}

KnowledgeBase.defaultProps = {
  docs: [],
  createDocument: null,
  deleteDocument: null,
}

export default KnowledgeBase
