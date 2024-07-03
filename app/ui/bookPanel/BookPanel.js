import React from 'react'
import PropTypes from 'prop-types'
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Space } from 'antd'
import find from 'lodash/find'

import ChapterList from './ChapterList'
import MetadataModal from '../bookMetadata/BookMetadataForm'
import MetadataLockedModal from '../bookMetadata/BookMetadataLocked'
import { Button } from '../common'

const LeftPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: ${grid(3)};
`

const TitleArea = styled.div`
  flex-shrink: 0;
  font-size: 26px;
  margin-bottom: ${grid(4)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`

const MetadataArea = styled.div`
  border-bottom: 1px solid ${th('colorBorder')};
  border-top: 1px solid ${th('colorBorder')};
  flex-shrink: 0;
  margin-bottom: ${grid(4)};
  padding: ${grid(2)} 0;
  width: 100%;
`

const ChaptersArea = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
`

const ChaptersHeader = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  margin-bottom: ${grid(2)};
  padding: ${grid(1)};
  width: 100%;

  button {
    border-radius: 0;
  }
`

const ChaptersActions = styled(Space)``

const StyledHeading = styled.div`
  text-transform: uppercase;
  width: 85%;
`

const IconWrapper = styled(Button)`
  cursor: pointer;
`

const StyledModalButton = styled(Button)`
  border-radius: 0;
  text-align: left;
  width: 100%;
`

const BookPanel = props => {
  const {
    className,
    chapters,
    onDeleteChapter,
    onChapterClick,
    selectedChapterId,
    onReorderChapter,
    title,
    onAddChapter,
    onUploadChapter,
    onSubmitBookMetadata,
    bookMetadataValues,
    chaptersActionInProgress,
    canEdit,
    metadataModalOpen,
    setMetadataModalOpen,
    onBookComponentTypeChange,
    onBookComponentParentIdChange,
  } = props

  const closeModal = () => {
    setMetadataModalOpen(false)
  }

  let showFormModal = false
  let showLockedModal = false

  if (metadataModalOpen) {
    // Do no show meta data form if chapters are being processed
    showLockedModal = find(chapters, { uploading: true })
    showFormModal = !showLockedModal
  }

  return (
    <LeftPanelWrapper className={className}>
      <TitleArea>{title || 'Untitled Book'}</TitleArea>
      <MetadataArea>
        <StyledModalButton
          onClick={() => setMetadataModalOpen(true)}
          type="text"
        >
          Book Metadata
        </StyledModalButton>
      </MetadataArea>
      <MetadataModal
        canChangeMetadata={canEdit}
        closeModal={closeModal}
        initialValues={bookMetadataValues}
        onSubmitBookMetadata={onSubmitBookMetadata}
        open={showFormModal}
      />
      <MetadataLockedModal closeModal={closeModal} open={showLockedModal} />

      <ChaptersArea>
        <ChaptersHeader>
          <StyledHeading>Chapters</StyledHeading>
          <ChaptersActions>
            <IconWrapper
              aria-label="Upload a chapter"
              disabled={!canEdit}
              icon={<CloudUploadOutlined />}
              onClick={onUploadChapter}
              title="Upload a chapter"
              type="text"
            />
            <IconWrapper
              aria-label="Create a chapter"
              disabled={!canEdit}
              icon={<PlusOutlined />}
              onClick={onAddChapter}
              title="Create a chapter"
              type="text"
            />
          </ChaptersActions>
        </ChaptersHeader>
        <ChapterList
          canEdit={canEdit}
          chapters={chapters}
          chaptersActionInProgress={chaptersActionInProgress}
          onBookComponentParentIdChange={onBookComponentParentIdChange}
          onBookComponentTypeChange={onBookComponentTypeChange}
          onChapterClick={onChapterClick}
          onDeleteChapter={onDeleteChapter}
          onReorderChapter={onReorderChapter}
          selectedChapterId={selectedChapterId}
        />
      </ChaptersArea>
    </LeftPanelWrapper>
  )
}

BookPanel.propTypes = {
  title: PropTypes.string,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      lockedBy: PropTypes.string,
    }),
  ),
  onDeleteChapter: PropTypes.func.isRequired,
  selectedChapterId: PropTypes.string,
  onAddChapter: PropTypes.func.isRequired,
  onChapterClick: PropTypes.func.isRequired,
  onUploadChapter: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onReorderChapter: PropTypes.func.isRequired,
  bookMetadataValues: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    authors: PropTypes.string.isRequired,
    isbns: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        isbn: PropTypes.string.isRequired,
      }),
    ).isRequired,
    topPage: PropTypes.string,
    bottomPage: PropTypes.string,
    copyrightLicense: PropTypes.string,
    ncCopyrightHolder: PropTypes.string,
    ncCopyrightYear: PropTypes.string,
    saCopyrightHolder: PropTypes.string,
    saCopyrightYear: PropTypes.string,
    licenseTypes: PropTypes.shape({
      NC: PropTypes.bool,
      SA: PropTypes.bool,
      ND: PropTypes.bool,
    }),
    publicDomainType: PropTypes.string,
  }).isRequired,
  onSubmitBookMetadata: PropTypes.func.isRequired,
  metadataModalOpen: PropTypes.bool.isRequired,
  setMetadataModalOpen: PropTypes.func.isRequired,
  chaptersActionInProgress: PropTypes.bool.isRequired,
  onBookComponentTypeChange: PropTypes.func,
  onBookComponentParentIdChange: PropTypes.func,
}
BookPanel.defaultProps = {
  chapters: [],
  selectedChapterId: undefined,
  title: null,
  onBookComponentTypeChange: null,
  onBookComponentParentIdChange: null,
}

export default BookPanel
